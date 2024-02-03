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
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const prisma = new client_1.PrismaClient();
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: "*",
    methods: "GET, OPTIONS, PUT, POST, DELETE"
}));
app.get("/list", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const lists = yield prisma.compra.findMany();
    res.send(lists);
}));
app.post("/list", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { creation_date } = req.body;
    try {
        const listWithSameDate = yield prisma.compra.findFirst({
            where: { creation_date: { equals: new Date(creation_date) } },
        });
        if (listWithSameDate) {
            return res.status(409).send({ message: "Já existe uma lista de compras criada nessa data" });
        }
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
    }
    catch (error) {
        return res.status(500).send({ message: "Falha ao criar a lista" });
    }
    res.status(201).send();
}));
app.delete("/list/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const idList = Number(req.params.id);
    try {
        const list = yield prisma.compra.findUnique({ where: { id: idList } });
        if (!list) {
            return res.status(404).send({ message: "A lista não foi encontrada" });
        }
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
    }
    catch (error) {
        res.status(500).send({ message: "Não foi possível remover a lista" });
    }
    res.status(200).send();
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
    try {
        const itenWithSameName = yield prisma.iten.findFirst({
            where: { name: { equals: name, mode: "insensitive" } },
        });
        if (itenWithSameName) {
            return res.status(409).send({ message: "Já existe um item com esse nome cadastrado" });
        }
        yield prisma.iten.create({
            data: {
                list_id: Number(list_id),
                name: name,
                amount: Number(amount),
                price: Number(price)
            }
        });
        yield prisma.histori_iten.create({
            data: {
                list_id: Number(list_id),
                name: name,
                amount: Number(amount),
                price: Number(price)
            }
        });
    }
    catch (error) {
        return res.status(500).send({ message: "Falha ao cadastrar item" });
    }
    res.status(201).send();
}));
app.delete("/itens/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(req.params.id);
    try {
        const iten = yield prisma.iten.findUnique({ where: { id: id } });
        if (!iten) {
            return res.status(404).send({ message: "O item não foi encontrado" });
        }
        yield prisma.iten.delete({
            where: {
                id: id
            }
        });
    }
    catch (error) {
        return res.status(500).send({ message: "Não foi possível remover o item" });
    }
    res.status(200).send();
}));
app.get("/historic_itens", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const historicItens = yield prisma.histori_iten.findMany();
    res.status(201).send(historicItens);
}));
app.listen(5432, () => {
    console.log("Servidor em execução");
});
