import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User, { UserDocument, UserRole } from '../models/User';
import { RegisterInput, LoginInput } from '../dtos/auth.dto';
import { AppError } from '../utils/appError';

type PublicUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
};

type AuthResponse = {
  token: string;
  user: PublicUser;
};

const toPublicUser = (user: UserDocument): PublicUser => ({
  id: user._id.toString(),
  name: user.name,
  email: user.email,
  role: user.role
});

const signToken = (user: UserDocument): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new AppError('JWT_SECRET is required', 500);
  }
  const expiresIn = (process.env.JWT_EXPIRES_IN ?? '1d') as jwt.SignOptions['expiresIn'];
  return jwt.sign({ id: user._id.toString(), email: user.email, role: user.role }, secret, { expiresIn });
};

const register = async (input: RegisterInput): Promise<AuthResponse> => {
  const existing = await User.findOne({ email: input.email }).exec();
  if (existing) {
    throw new AppError('User already exists', 409);
  }
  const hashedPassword = await bcrypt.hash(input.password, 10);
  const user = new User({
    name: input.name,
    email: input.email,
    password: hashedPassword,
    role: input.role ?? 'user'
  });
  await user.save();
  const token = signToken(user);
  return { token, user: toPublicUser(user) };
};

const login = async (input: LoginInput): Promise<AuthResponse> => {
  const user = await User.findOne({ email: input.email }).exec();
  if (!user) {
    throw new AppError('Invalid credentials', 401);
  }
  const valid = await bcrypt.compare(input.password, user.password);
  if (!valid) {
    throw new AppError('Invalid credentials', 401);
  }
  const token = signToken(user);
  //console.log('Login successful for user:', user.email);
  return { token, user: toPublicUser(user) };
};

export { register, login, PublicUser, AuthResponse };
