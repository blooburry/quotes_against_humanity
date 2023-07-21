import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { User } from '@prisma/client';
import { Observable, from } from 'rxjs';

@Injectable()
export class UserService {
    constructor(
        private prisma: PrismaService
    ){}

    getUser(id: number): Observable<User | null> {
        return from(this.prisma.user.findUnique({
          where: { id: Number(id) },
        }));
    }

    getUserByName(username: string): Observable<User | null> {
        return from(this.prisma.user.findUnique({
            where: { username: String(username) }
        }))
    }
}
