import { IAppConfig } from "../__shared__/interfaces/app-config.interface";
import { JwtRefreshStrategy } from "./strategies/refresh-jwt.strategy";
import { PasswordEncryption } from "./utils/password-encrytion.util";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { SesService } from "src/notifications/ses.service";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { UsersModule } from "src/users/users.module";
import { AuthController } from "./auth.controller";
import { PassportModule } from "@nestjs/passport";
import { Global, Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { JwtModule } from "@nestjs/jwt";

@Global()
@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService<IAppConfig>) => ({
        secret: configService.get("jwt").secret,
        signOptions: {
          expiresIn: configService.get("jwt").expiresIn,
          issuer: "crew-api",
        },
      }),
      inject: [ConfigService],
    }),
    UsersModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    JwtRefreshStrategy,
    ConfigService,
    PasswordEncryption,
    SesService,
  ],
  exports: [JwtModule, AuthService],
})
export class AuthModule {}
