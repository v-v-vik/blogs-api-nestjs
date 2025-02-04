import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class RtJwtAuthGuard extends AuthGuard('jwt-refresh') {}
