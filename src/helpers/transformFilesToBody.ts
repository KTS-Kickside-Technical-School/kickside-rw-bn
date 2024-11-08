import { Response, NextFunction } from "express";
export const transformFilesToBody = (req: any, res: Response, next: NextFunction): Promise<any> => {
    if (req.file) {
        req.body.file = req.file.path;
    }

    if (req.files) {
        const files = req.files as Express.Multer.File[];
        req.body.images = files.map((file) => file.path);
    }
    if (!req.file && !req.files) {
        res
            .status(400)
            .json({
                status: 400,
                message: "Image(s) are required",
            });
        return;
    }

    next();
    return
};