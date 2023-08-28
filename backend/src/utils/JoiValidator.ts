import { NextFunction , Request , Response } from "express";

 const JoiValidator = (
	validationSchema : any,
	key: 'body' | 'query' | 'headers' = 'body'
) => {
	return (req : Request, res : Response , next : NextFunction) => {
		const data = req[key];
		console.log(data);
		const { error : e } = validationSchema.validate(data, {
			errors: {
				wrap: false,
			},
		});
		if (e) {
			return res.status(400).json(e)
		}

		next();
	};
};

export default JoiValidator ;