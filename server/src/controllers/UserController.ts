import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

import { validateDocument, validateEmail } from "../utilities/validations";

const prisma = new PrismaClient();

export class UserController {
  async index(req: Request, res: Response) {
    const foundUsers = (
      await prisma.user.findMany({
        where: {
          deleted_at: null,
        },
      })
    ).map((user) => {
      const { password, ...newUser } = user;
      return newUser;
    });

    return res.status(200).json({
      message: "Users found successfully.",
      data: foundUsers,
    });
  }

  async create(req: Request, res: Response) {
    try {
      const { cnpj, email, username, password, phone } = req.body;

      if (!cnpj || !email || !username || !password || !phone) {
        return res.status(400).json({
          error: "Missing or invalid data",
          message: "Please provide all required fields.",
        });
      }

      if (!validateDocument(cnpj)) {
        return res.status(400).json({
          error: "Invalid CNPJ",
          message: "Please provide a valid CNPJ.",
        });
      }

      if (!validateEmail(email)) {
        return res.status(400).json({
          error: "Invalid email address",
          message: "Please provide a valid email address.",
        });
      }

      const foundUser = await prisma.user.findFirst({
        where: { OR: [{ cnpj }, { email }], deleted_at: null },
      });

      if (foundUser) {
        return res.status(409).json({
          error: "User already exists",
          message: "A user with the provided CNPJ or email already exists.",
        });
      }

      const createdUser = await prisma.user.create({
        data: {
          cnpj,
          email,
          username,
          password,
          phone,
        },
      });

      return res.status(201).json({
        message: "User created successfully.",
        data: createdUser,
      });
    } catch (exception) {
      return res.status(500).json({ error: exception });
    }
  }

  async destroy(req: Request, res: Response) {
    const { id } = req.params;

    const foundUser = await prisma.user.findUnique({
      where: { id, deleted_at: null },
    });

    if (!foundUser) {
      return res.status(404).json({
        error: "User not found",
        message: "Please provide the ID of an existing user.",
      });
    }

    await prisma.user.update({
      where: {
        id,
      },
      data: {
        deleted_at: new Date(),
      },
    });

    return res.status(204).json({ message: "User deleted successfully." });
  }
}