import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { join } from 'path';
import { AppResolver } from './app.resolver';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { GraphQLError } from 'graphql';
import { RideModule } from './ride/ride.module';

@Module({
  imports: [
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
        installSubscriptionHandlers: true,
        sortSchema: true,
        playground: false,
        debug: configService.get<boolean>('DEBUG'),
        uploads: false,
        plugins: [ApolloServerPluginLandingPageLocalDefault()],
        formatError: (error) => {
          const originalError = error.extensions?.originalError as GraphQLError;
          if (!originalError) {
            return {
              message: error.message,
              code: error.extensions?.code,
            };
          }
          return originalError;
        },
      }),
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('DB_HOST'),
      }),
    }),
    ConfigModule.forRoot({
      cache: true,
    }),
    AuthModule,
    UserModule,
    RideModule,
  ],
  controllers: [],
  providers: [AppResolver],
})
export class AppModule {}
