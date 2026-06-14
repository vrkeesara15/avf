import { Router } from "express";
import rateLimit from "express-rate-limit";
import { z } from "zod";
import { getStore } from "../../store";
import { asyncHandler, parseBody, HttpError } from "../../lib/http";
import { signToken, verifyPassword } from "../../auth/jwt";
import { requireAuth } from "../../auth/middleware";
import type { AdminUser } from "../../types";

export const adminAuthRouter = Router();

// NFR-S05 — limit failed login attempts (5 per 15 minutes per IP).
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  message: { error: "Too many login attempts. Try again in 15 minutes." },
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

adminAuthRouter.post(
  "/login",
  loginLimiter,
  asyncHandler(async (req, res) => {
    const { email, password } = parseBody(loginSchema, req.body);
    const matches = await getStore().query<AdminUser>(
      "adminUsers",
      "email",
      "==",
      email.toLowerCase()
    );
    const user = matches[0];
    if (!user || !(await verifyPassword(password, user.passwordHash))) {
      throw new HttpError(401, "Invalid email or password");
    }
    const token = signToken({
      sub: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    });
    res.json({
      token,
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
    });
  })
);

adminAuthRouter.get(
  "/me",
  requireAuth,
  asyncHandler(async (req, res) => {
    res.json({ user: req.user });
  })
);
