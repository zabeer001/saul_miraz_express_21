import mongoose from "mongoose";
import { formatPaginationResponse } from "../helpers/formatPaginationResponse.js";
import Contact from "../models/contact.model.js";
import { conatctMail } from "../functionalController/emailNotificationController.js";


class ContactController {
    // POST /contacts
    static async store(req, res) {
        try {
            const { name, email, how_can_we_help, type } = req.body;

            if (!name || !email || !how_can_we_help) {
                return res.status(400).json({ success: false, message: 'Name, email, and how_can_we_help are required.' });
            }

            const contact = await Contact.create({
                name,
                email,
                how_can_we_help,
                type: type || 'general',
            });

            conatctMail(name,email,how_can_we_help);

            return res.status(201).json({ success: true, data: contact });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }

    // GET /contacts
    static async index(req, res) {
        try {
            const params = req.query;
            const search = params.search?.trim(); // Get and trim search query for name
            
            const id = params.id; // Get _id filter (e.g., '6871faa1dc12bd7ece0e3ff4')

            const page = parseInt(params?.page, 10) ?? 1;
            const per_page = parseInt(params?.paginate_count, 10) ?? 10;

            // Build query object for filtering
            const query = {};

            // Add search filter (case-insensitive search on name, email, or exact _id match)
            if (search) {
                // Check if search is a valid ObjectId for _id filtering
                const isValidObjectId = mongoose.Types.ObjectId.isValid(search);

                query.$or = [
                    { name: { $regex: search, $options: 'i' } }, // Search in name
                    { email: { $regex: search, $options: 'i' } }, // Search in email
                ];

                // Add _id to search if it's a valid ObjectId
                if (isValidObjectId) {
                    query.$or.push({ _id: search });
                }
            }

            const options = {
                page,
                limit: per_page,
                sort: { createdAt: -1 },
                lean: true,
            };

            // Execute paginated query with filters
            const paginationResult = await Contact.paginate(query, options);
            const data = formatPaginationResponse(paginationResult, params, req);

            return res.status(200).json({
                success: true,
                ...data, // Spread data to align with previous services
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: `Failed to fetch contacts: ${error.message}`,
            });
        }
    }

   

    // GET /contacts/:id
    static async show(req, res) {
        try {
            const { id } = req.params;

            const contact = await Contact.findById(id);

            if (!contact) {
                return res.status(404).json({ success: false, message: 'Contact not found.' });
            }

            return res.status(200).json({ success: true, data: contact });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }

    // PUT /contacts/:id
    static async update(req, res) {
        try {
            const { id } = req.params;
            const { name, email, message, type } = req.body;

            const contact = await Contact.findById(id);

            if (!contact) {
                return res.status(404).json({ success: false, message: 'Contact not found.' });
            }

            contact.name = name ?? contact.name;
            contact.email = email ?? contact.email;
            contact.message = message ?? contact.message;
            contact.type = type ?? contact.type;

            await contact.save();

            return res.status(200).json({ success: true, data: contact });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }

    // DELETE /contacts/:id
    static async destroy(req, res) {
        try {
            const { id } = req.params;

            const contact = await Contact.findById(id);

            if (!contact) {
                return res.status(404).json({ success: false, message: 'Contact not found.' });
            }

            await contact.deleteOne();

            return res.status(200).json({ success: true, message: 'Contact deleted successfully.' });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }
}

export default ContactController;
