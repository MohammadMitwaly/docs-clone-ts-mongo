import { model, Schema } from "mongoose";

const Document = new Schema({ _id: String, data: Object });

export default model("Document", Document);
