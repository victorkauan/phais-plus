import bcrypt from "bcrypt";
import { prismaClient } from "../../infra/database/prismaClient";
import { formatResponse } from "../../utilities/formatting";
import {
  validateDocument,
  validateEmail,
  validatePassword,
} from "../../utilities/validation";

type CreateUserRequest = {
  cnpj: string;
  email: string;
  username: string;
  password: string;
  phone: string;
};

export class CreateUserUseCase {
  constructor() {}

  async execute(data: CreateUserRequest) {
    const { cnpj, email, username, password, phone } = data;

    if (!cnpj || !email || !username || !password || !phone) {
      return formatResponse(400, "Please provide all required fields.");
    }

    if (!validateDocument(cnpj)) {
      return formatResponse(400, "Please provide a valid CNPJ.");
    }

    if (!validateEmail(email)) {
      return formatResponse(400, "Please provide a valid email address.");
    }

    if (!validatePassword(password)) {
      return formatResponse(400, "The password must be at least 8 characters.");
    }

    const foundUser = await prismaClient.user.findUnique({
      where: { cnpj, deleted_at: null },
    });

    if (foundUser) {
      return formatResponse(
        409,
        "A user with the provided CNPJ already exists."
      );
    }

    const encryptedPassword = await bcrypt.hash(password, 10);
    const createdUser = await prismaClient.user.create({
      data: { cnpj, email, username, password: encryptedPassword, phone },
      select: {
        id: true,
        cnpj: true,
        email: true,
        username: true,
        phone: true,
        created_at: true,
        updated_at: true,
      },
    });

    return formatResponse(201, "User created successfully.", createdUser);
  }
}
