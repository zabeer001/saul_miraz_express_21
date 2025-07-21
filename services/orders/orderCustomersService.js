import { formatPaginationResponse } from "../../helpers/formatPaginationResponse.js";
import User from "../../models/user.model.js";
import Order from "../../models/order.model.js";

export const orderCustomersService = async (req) => {
    try {
        const params = req.query;

        // Parse pagination params
        const page = Number.isInteger(parseInt(params?.page, 10)) ? parseInt(params.page, 10) : 1;
        const perPage = Number.isInteger(parseInt(params?.paginate_count, 10)) ? parseInt(params.paginate_count, 10) : 10;
        const skip = (page - 1) * perPage;
        const search = (params.search || params.serach)?.trim() || "";
        const statusFilter = params.status?.toLowerCase();

        const lastMonth = new Date();
        lastMonth.setMonth(lastMonth.getMonth() - 1);

        // ----------------------------
        // Customer List Pipeline
        // ----------------------------
        const pipeline = [
            {
                $lookup: {
                    from: "orders",
                    let: { userId: "$_id" },
                    pipeline: [
                        { $match: { $expr: { $eq: ["$user_id", "$$userId"] } } },
                        { $match: { createdAt: { $gte: lastMonth } } }
                    ],
                    as: "recentOrders"
                }
            },
            {
                $addFields: {
                    orders_count: { $size: "$recentOrders" },
                    orders_sum_total: { $sum: "$recentOrders.total" },
                    status: {
                        $cond: { if: { $gt: [{ $size: "$recentOrders" }, 0] }, then: "active", else: "inactive" }
                    }
                }
            },
            ...(statusFilter ? [{ $match: { status: statusFilter } }] : []),
            ...(search ? [{
                $match: {
                    $or: [
                        { email: { $regex: search, $options: "i" } },
                        { phone: { $regex: search, $options: "i" } }
                    ]
                }
            }] : []),
            {
                $match: { orders_count: { $gt: 0 } }
            },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    email: 1,
                    phone: 1,
                    full_address: 1,
                    city: 1,
                    state: 1,
                    postal_code: 1,
                    country: 1,
                    orders_count: 1,
                    orders_sum_total: 1,
                    status: 1
                }
            },
            { $sort: { status: 1, orders_count: -1 } },
            { $skip: skip },
            { $limit: perPage }
        ];

        const customers = await User.aggregate(pipeline);

        // ----------------------------
        // Stats Calculations
        // ----------------------------

        // Total unique customers (all time)
        const totalCustomers = await Order.distinct("user_id").then(res => res.length);

        // New customers in last month
        const new_customers = await Order.distinct("user_id", {
            createdAt: { $gte: lastMonth }
        }).then(res => res.length);

        // Inactive customers (never ordered in last month)
        const inactiveCustomers = totalCustomers - new_customers;

        // Average Order Value
        const avgOrder = await Order.aggregate([
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: "$total" },
                    totalOrders: { $sum: 1 }
                }
            },
            {
                $project: {
                    _id: 0,
                    averageOrderValue: {
                        $cond: [{ $eq: ["$totalOrders", 0] }, 0, { $divide: ["$totalRevenue", "$totalOrders"] }]
                    }
                }
            }
        ]);
        const averageOrderValue = avgOrder[0]?.averageOrderValue || 0;

        // Count total customers for pagination (with at least 1 order in last month)
        const totalResult = await User.aggregate([
            {
                $lookup: {
                    from: "orders",
                    let: { userId: "$_id" },
                    pipeline: [
                        { $match: { $expr: { $eq: ["$user_id", "$$userId"] } } },
                        { $match: { createdAt: { $gte: lastMonth } } }
                    ],
                    as: "recentOrders"
                }
            },
            { $addFields: { orders_count: { $size: "$recentOrders" } } },
            { $match: { orders_count: { $gt: 0 } } },
            { $count: "total" }
        ]);
        const total = totalResult[0]?.total || 0;

        const stats = {
            totalCustomers,
            new_customers,
            inactiveCustomers,
            averageOrderValue: parseFloat(averageOrderValue.toFixed(2))
        }

        // ----------------------------
        // Build final response
        // ----------------------------
        const options = {
            docs: customers,
            totalDocs: total,
            limit: perPage,
            page,
            totalPages: Math.ceil(total / perPage),

        };


        return { success: true, ...formatPaginationResponse(options, params, req), stats };

    } catch (error) {
        throw new Error(`Failed to fetch customers with orders: ${error.message}`);
    }
};
