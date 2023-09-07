import { Request } from 'express';
import { Admin } from 'src/models/schemas/admin.schema';

interface RequestWithAdmin extends Request {
  admin: Admin;
}

export default RequestWithAdmin;
