import authRepositories from "../repository/authRepositories"

export const isUserExists = async (req, res, next) => {
    try {
        const user = await authRepositories.findUserByAttribute("email", req.body.email);
        if (!user) {
            return res.status(404).json({
                status: 401,
                message: "User not found"
            })
        }
        req.user = user;
        return next();
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: error.message
        })
    }
}