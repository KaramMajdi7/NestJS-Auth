import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Book } from '../schemas/book.schema';
import * as mongoose from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Query } from 'express-serve-static-core';
import { User } from 'src/schemas/user.schema';

@Injectable()
export class BookService {

    logger: Logger = new Logger('BookController');

    constructor(
        @InjectModel(Book.name) 
        private bookModel: mongoose.Model<Book>,
    ) {}

    async findAll(query: Query): Promise<Book[]> {

        const resPerPage = 2;
        const currentPage = Number(query.page) || 1;
        const skip = resPerPage * (currentPage - 1);

        const keyword = query.keyword ? {
            title: {
                $regex: query.keyword,
                $options: 'i'
            }
        } : {};

        const books = await this.bookModel.find({ ...keyword }).limit(resPerPage).skip(skip);
        // this.logger.log(`Found ${books.length} books`);
        // this.logger.log(`Here are the books found: ${JSON.stringify(books)}`);
        return books;
    }

    async findOne(id: string) {

        const isValidId = mongoose.isValidObjectId(id);

        if(!isValidId) {
            throw new BadRequestException('Invalid book id');
        }

        const book = await this.bookModel.findById(id);

        if (!book) {
            throw new NotFoundException('Book not found');
        }

        return book;
    }

    async create(book: Book, user: User): Promise<Book> {

        const data = Object.assign(book, { user: user._id });

        const newBook = await this.bookModel.create(data);
        
        return newBook;
    }

    async updateById(id: string, book: Book): Promise<Book> {
        const updatedBook = await this.bookModel.findOneAndUpdate({ _id: id }, book, { new: true, runValidators: true });
        return updatedBook;
    }

    async deleteById(id: string): Promise<Book> {
        const deletedBook = await this.bookModel.findOneAndDelete({ _id: id });
        return deletedBook;
    }

}
