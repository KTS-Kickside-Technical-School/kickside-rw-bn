import authRepositories from "../repository/authRepositories"

export const isUserExists = async (req, res, next) => {
    try {
        const user = await authRepositories.findUserByAttribute("email", req.body.email);
        if (!user) {
            return res.status(404).json({
                status: 404,
                message: "User not found"
            })
        }
        req.user = user;
        return next();
    } catch (error) {
        console.error("Error checking user existences", error);
        res.status(500).json({
            status: 500,
            message: error.message
        })
    }
}