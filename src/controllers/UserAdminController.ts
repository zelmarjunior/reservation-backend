import { Request, Response, Router } from 'express';
import UserAdminRepository from '../repositories/UserAdminRepository';
import bcrypt from 'bcrypt';
import jwt, { JwtPayload } from 'jsonwebtoken';

const UserAdminRouter = Router();

UserAdminRouter.get('/', async (_req: Request, res: Response,): Promise<Response> => {
    const users = await UserAdminRepository.getAllUsers();
    return res.status(200).json(users);
});

UserAdminRouter.post('/createUser', async (req: Request, res: Response,): Promise<Response> => {
    const { username, password, role, restaurantId } = req.body;

    const userExistis = await UserAdminRepository.getUser(username);

    if (userExistis) res.status(400).send('User Already Exists');

    const hashPassword = await bcrypt.hash(password, 10);
    try {
        const newUser = await UserAdminRepository.createUser(username, hashPassword, role, restaurantId);
        console.log(newUser);

        return res.status(201).json({ newUser })
    } catch (error) {
        res.status(400).send('Error on create user.');
    }
});

UserAdminRouter.post('/login', async (req: Request, res: Response,): Promise<Response> => {
    const { username, password } = req.body;

    const user = await UserAdminRepository.getUser(username);

    if (!user) res.status(400).send('Usuário ou senha incorreta!');

    const verifyPass = await bcrypt.compare(password, user.password);

    if (!verifyPass) res.status(400).send('Usuário ou senha incorreta!');

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET_KEY, { expiresIn: '8h' });

    return res.status(200).json({ token })
});


UserAdminRouter.post('/auth', );



export default UserAdminRouter;