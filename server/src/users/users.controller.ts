import { Controller, Get, Param, Query } from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { UserService } from 'src/user/user.service';
import { User } from '@prisma/client';

@Controller('users')
export class UsersController {
    constructor(
        private userService: UserService
    ){}

    @Get('check-username')
    checkUsername(@Query('username') username: string): Observable<{exists: boolean}> {
        const user: Observable<User | null> = this.userService.getUserByName(username);
        const userExists = user.pipe(
            map(u => {
                return { exists: u !== null };
            })
        )
        return userExists;
    }

    @Get(':id')
    getUser(@Param('id') id): Observable<User> {
        return this.userService.getUser(id);
    }
}
