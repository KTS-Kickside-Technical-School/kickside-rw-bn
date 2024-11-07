// import { Request, Response, NextFunction } from "express";
// import { decodeToken } from "../helpers/authHelpers";

// export const userAuthorization = function (roles: string[]) {
//     return async (req: any, res: Response, next: NextFunction) => {
//         try {
//             const token = req.headers["authorization"]?.split(" ")[1];

//             if (!token) {
//                 return res
//                     .status(401)
//                     .json({ status: 401, message: "Not authorized" });
//             }

//             const decoded: any = await decodeToken(token);

//             const session = await authRepository.findSessionByUserIdAndToken(
//                 decoded._id, token
//             );
//             if (!session) {
//                 return res
//                     .status(401)
//                     .json({ status: 401, message: "Not authorized" });
//             }

//             const user = await authRepository.findUserByAttributes("id", decoded.id);
//             if (!user) {
//                 return res
//                     .status(401)
//                     .json({ status: 401, message: "Not authorized" });
//             }

//             if (user.status !== "enabled") {
//                 return res
//                     .status(401)
//                     .json({ status: 401, message: "Not authorized" });
//             }

//             if (!roles.includes(user.role)) {
//                 return res
//                     .status(401)
//                     .json({ status: 401, message: "Not authorized" });
//             }

//             req.user = user;
//             req.session = session;
//             next();
//         } catch (error: any) {
//             res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
//                 status: httpStatus.INTERNAL_SERVER_ERROR,
//                 message: error.message,
//             });
//         }
//     };
// };

// export const socketAuthMiddleware = async (socket: Socket, next: NextFunction) => {
//     try {
//         const token = socket.handshake.auth.token;
//         if (!token) {
//             const err = new Error("Authentication error") as ExtendedError;
//             err.data = { message: "No token provided" };
//             return next(err);
//         }

//         const decoded = await decodeToken(token);
//         if (!decoded || typeof decoded !== "object") {
//             const err = new Error("Authentication error") as ExtendedError;
//             err.data = { message: "Invalid token" };
//             return next(err);
//         }

//         const session: Session = await authRepository.findSessionByUserIdAndToken(decoded.id, token);
//         if (!session) {
//             const err = new Error("Authentication error") as ExtendedError;
//             err.data = { message: "Session not found or expired" };
//             return next(err);
//         }

//         const user = await authRepository.findUserByAttributes("id", decoded.id);
//         if (!user) {
//             const err = new Error("Authentication error") as ExtendedError;
//             err.data = { message: "User not found" };
//             return next(err);
//         }

//         if (!socket.data) {
//             socket.data = {};
//         }

//         socket.data.user = {
//             id: user.id,
//             firstName: user.firstName,
//             lastName: user.lastName,
//             email: user.email,
//             role: user.role,
//             profilePicture: user.profilePicture,
//         };

//         next();
//     } catch (error) {
//         const err = new Error("Internal server error") as ExtendedError;
//         err.data = { message: "Internal server error" };
//         return next(err);
//     }
// };