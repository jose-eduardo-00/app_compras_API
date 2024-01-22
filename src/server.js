"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const cors = __importStar(require("cors"));
const app = (0, express_1.default)();
const prisma = new client_1.PrismaClient();
const options = {
    methods: "GET, OPTIONS, PUT, POST, DELETE",
    origin: "http://localhost:5173/"
};
app.use(express_1.default.json());
app.use(cors(options));
app.get("/list", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const lists = yield prisma.compra.findMany();
    res.send(lists);
}));
app.post("/list", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { creation_date } = req.body;
    yield prisma.compra.create({
        data: {
            creation_date: new Date(creation_date)
        }
    });
    yield prisma.historic.create({
        data: {
            creation_date: new Date(creation_date)
        }
    });
    res.status(201).send();
}));
app.delete("/list/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const idList = Number(req.params.id);
    yield prisma.iten.deleteMany({
        where: {
            list_id: idList
        }
    });
    yield prisma.compra.delete({
        where: {
            id: idList
        }
    });
    res.status(201).send();
}));
app.get("/historic", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const historics = yield prisma.historic.findMany();
    res.send(historics);
}));
app.get("/itens", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const itens = yield prisma.iten.findMany();
    res.send(itens);
}));
app.post("/itens", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { list_id, name, amount, price } = req.body;
    yield prisma.iten.create({
        data: {
            list_id: list_id,
            name: name,
            amount: amount,
            price: price
        }
    });
    res.status(201).send();
}));
app.delete("/itens/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(req.params.id);
    yield prisma.iten.delete({
        where: {
            id: id
        }
    });
    res.status(201).send();
}));
app.listen(3000, () => {
    console.log("Servidor em execução");
});
