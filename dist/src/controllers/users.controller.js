"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_model_1 = __importDefault(require("../models/user.model"));
class UsersController {
    getAllUsers(_req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield user_model_1.default.findAllUsers();
                if (!users) {
                    res.status(404).json({ error: 'The users are not found.' });
                    throw new Error('The users are not found.');
                }
                res.status(200).json(users);
            }
            catch (error) {
                console.error(`${error}`);
                res.status(500).json({
                    error: `An internal server error occurred: ${error.message}`,
                });
            }
        });
    }
    getUserById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.token.id;
                const user = yield user_model_1.default.findUserById(id);
                if (user === null) {
                    res.status(404).json({ error: 'The user is not found.' });
                    throw new Error('The user is not found.');
                }
                res.status(200).json(user);
            }
            catch (error) {
                console.error(`${error}`);
                res.status(500).json({
                    error: `An internal server error occurred: ${error.message}`,
                });
            }
        });
    }
    updateUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.token.id;
                const userData = req.body;
                const updatedUser = yield user_model_1.default.updateUserData(userId, userData);
                if (!updatedUser) {
                    res.status(404).json({ error: 'The user is not found.' });
                    throw new Error('The user is not found.');
                }
                res.status(204).json({ message: 'The user successfully updated!' });
            }
            catch (error) {
                console.error(error);
                res.status(500).json({
                    error: `An internal server error occurred: ${error.message}`,
                });
            }
        });
    }
    uploadUserPicture(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.token.id;
                const filePicture = req.file;
                if (!filePicture) {
                    res.status(400).json({ error: 'No picture was uploaded.' });
                    throw new Error('No picture was uploaded.');
                }
                const storedPictureFileName = yield user_model_1.default.storePictureFileName(userId, filePicture.filename);
                if (!storedPictureFileName) {
                    res.status(404).json({ error: 'The user is not found.' });
                    throw new Error('The user is not found.');
                }
                res.status(204).json({
                    message: 'The picture successfully uploaded!',
                });
            }
            catch (error) {
                console.error(error);
                res.status(500).json({
                    error: `An internal server error occurred: ${error.message}`,
                });
            }
        });
    }
    getUrlPicture(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.token.id;
                const existedFileName = yield user_model_1.default.findPictureFileName(userId);
                if (existedFileName === null) {
                    res.status(404).json({ error: 'The user is not found.' });
                    throw new Error('The user is not found.');
                }
                if (existedFileName === undefined) {
                    res.status(404).json({ error: 'The picture is not found.' });
                    throw new Error('The picture is not found.');
                }
                const picturePath = process.env.SERVER_DOMAIN ||
                    `localhost:${process.env.SERVER_PORT || 3000}` +
                        `/assets/images/${existedFileName}`;
                res.status(200).json({ picturePath });
            }
            catch (error) {
                console.error(error);
                res.status(500).json({
                    error: `An internal server error occurred: ${error.message}`,
                });
            }
        });
    }
    deleteUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = Number(req.params.id);
                const deletedUser = yield user_model_1.default.deleteUser(userId);
                if (deletedUser === null) {
                    res.status(404).json({ error: 'The user is not found.' });
                    throw new Error('The user is not found.');
                }
                res.status(204).json({ message: 'The user successfully deleted!' });
            }
            catch (error) {
                console.error(error);
                res.status(500).json({
                    error: `An internal server error occurred: ${error.message}`,
                });
            }
        });
    }
}
exports.default = new UsersController();
//# sourceMappingURL=users.controller.js.map