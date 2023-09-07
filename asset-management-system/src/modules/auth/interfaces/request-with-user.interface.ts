import { Request } from 'express';
// import UserEntity from 'src/models/entities/user.entity';
import { User } from 'src/models/schemas/user.schema';

interface RequestWithUser extends Request {
  user: User;
}

export default RequestWithUser;
