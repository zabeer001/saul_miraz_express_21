import { orderCustomersService } from "../services/orders/orderCustomersService.js";


class CustomerController {
    static async customers(req, res) {
        try {
            // Example debugging line (remove it later)
            // return 'fucked up';

            const result = await orderCustomersService(req);
            return res.status(200).json({
                message: "Customers retrieved successfully",
                data: result,
            });
        } catch (error) {
            return res.status(500).json({
                message: "Failed to retrieve customers",
                error: error.message,
            });
        }
    }
}

export default CustomerController;
