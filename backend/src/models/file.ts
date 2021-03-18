import mongoose from 'mongoose';

interface IFile {
    name: string;
    path: string;
    type: string;
}

interface fileModelInterface extends mongoose.Model<FileDoc> {
    build(attr: IFile): FileDoc
}
  
interface FileDoc extends mongoose.Document {
    title: string;
    path: string;
    type: string;
}

const fileSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    path: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    }
})

fileSchema.statics.build = (attr: IFile) => {
    return new File(attr)
}

const File = mongoose.model<FileDoc, fileModelInterface>('File', fileSchema)

File.build({
    name: 'some name',
    path: 'some path',
    type: 'some type'
})

export { File }