import { Body, Controller, Delete, Get, Logger, NotFoundException, Param, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { BookService } from './book.service';
import { Book } from '../schemas/book.schema';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Query as ExpressQuery } from 'express-serve-static-core';
import { AuthGuard } from '@nestjs/passport';

@Controller('book')
export class BookController {

    logger: Logger = new Logger('BookController');

    constructor(private readonly bookService: BookService) {}

    @Get()
    async findAll(@Query() query: ExpressQuery): Promise<Book[]> {
        return this.bookService.findAll(query);
    }

    @Get(':id')
    async findOne(@Param('id') id: string): Promise<Book> {
        const book = await this.bookService.findOne(id);
        return this.bookService.findOne(id);
    }

    @UseGuards(AuthGuard())
    @Post()
    async create(@Body() book: CreateBookDto, @Req() req) {
        // this.logger.log(req.user);
        return this.bookService.create(book, req.user);
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() book: UpdateBookDto) {
        return this.bookService.updateById(id, book);
    }

    @Delete(':id')
    async delete(@Param('id') id: string) {
        return this.bookService.deleteById(id);
    }
}
