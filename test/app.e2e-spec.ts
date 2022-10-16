import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { PrismaService } from 'src/prisma/prisma.service';
import * as pactum from 'pactum';
import { AuthDto } from 'src/auth/dto';
import { EditUserDto } from 'src/user/dto';
import { ListDto } from 'src/list/dto';
import { FavDto } from 'src/favs/dto';

describe('App e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );
    await app.init();
    await app.listen(3001);

    prisma = app.get(PrismaService);

    await prisma.cleanDb();
    pactum.request.setBaseUrl('http://localhost:3001');
  });

  afterAll(() => {
    app.close();
  });

  describe('Auth', () => {
    describe('Signup', () => {
      it('Should signup', () => {
        const dto: AuthDto = {
          email: 'asd@gmail.com',
          password: '123',
          firstName: 'Umut',
          lastName: '',
        };
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(dto)
          .expectStatus(201);
      });

      it('Shouldnt signup', () => {
        const dto: AuthDto = {
          email: 'asd@gmail.com',
          password: '123',
          firstName: 'Şentürk',
          lastName: '',
        };
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(dto)
          .expectStatus(403);
      });

      it('Shouldnt signup email empty', () => {
        const dto: AuthDto = {
          email: '',
          password: '123',
          firstName: '',
          lastName: '',
        };
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(dto)
          .expectStatus(400);
      });

      it('Shouldnt signup pw empty', () => {
        const dto: AuthDto = {
          email: 'asd@gmail.com',
          password: '',
          firstName: '',
          lastName: '',
        };
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(dto)
          .expectStatus(400);
      });

      it('Shouldn"t signup empty body', () => {
        return pactum.spec().post('/auth/signup').expectStatus(400);
      });
    });

    describe('Signin', () => {
      it('Should signin', () => {
        const dto: AuthDto = {
          email: 'asd@gmail.com',
          password: '123',
        };
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody(dto)
          .expectStatus(200)
          .stores('userAt', 'access_token');
      });

      it('Shouldn"t signin', () => {
        const dto: AuthDto = {
          email: 'asd2@gmail.com',
          password: '123',
          firstName: '',
          lastName: '',
        };
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody(dto)
          .expectStatus(403);
      });

      it('Shouldn"t signin pw empty', () => {
        const dto: AuthDto = {
          email: 'asd2@gmail.com',
          password: '',
          firstName: '',
          lastName: '',
        };
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody(dto)
          .expectStatus(400);
      });

      it('Shouldn"t signin email empty', () => {
        const dto: AuthDto = {
          email: '',
          password: '123',
          firstName: '',
          lastName: '',
        };
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody(dto)
          .expectStatus(400);
      });

      it('Shouldn"t signin empty body', () => {
        return pactum.spec().post('/auth/signin').expectStatus(400);
      });
    });
  });

  describe('User', () => {
    describe('Get me', () => {
      it('should get current user', () => {
        return pactum
          .spec()
          .get('/users/me')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(200);
      });

      it('shouldnt get current user without header', () => {
        return pactum.spec().get('/users/me').expectStatus(401);
      });
    });

    describe('Edit User', () => {
      it('shouldnt edit user by id bc of missing header', () => {
        const dto: EditUserDto = {
          lastName: 'ŞENTÜRK',
        };
        return pactum.spec().patch('/users').withBody(dto).expectStatus(401);
      });

      it('should edit user by id', () => {
        const dto: EditUserDto = {
          lastName: 'ŞENTÜRK',
        };
        return pactum
          .spec()
          .patch('/users')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .expectStatus(200)
          .expectBodyContains(dto.lastName);
      });
    });
  });

  describe('Lists', () => {
    describe('Get Empty Lists', () => {
      it('should show empty lists', () => {
        return pactum
          .spec()
          .get('/list')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(200)
          .expectBody([]);
      });
    });

    describe('Create Lists', () => {
      const dto: ListDto = {
        playlist_name: 'Playlist name',
      };
      it('should create list', () => {
        return pactum
          .spec()
          .post('/list')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .expectStatus(201);
      });

      it('should create list 2', () => {
        return pactum
          .spec()
          .post('/list')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .expectStatus(201)
          .stores('listId', 'id');
      });
    });

    describe('Get Lists', () => {
      it('should show lists', () => {
        return pactum
          .spec()
          .get('/list')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(200)
          .expectJsonLength(2);
      });
    });

    describe('Get List by id', () => {
      it('should show list by id', () => {
        return pactum
          .spec()
          .get('/list/{id}')
          .withPathParams({
            id: 1,
          })
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(200);
      });

      it('shouldnt show list by id', () => {
        return pactum
          .spec()
          .get('/list/{id}')
          .withPathParams({
            id: 3,
          })
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(200);
      });
    });

    describe('Edit Lists', () => {
      const dto: ListDto = {
        playlist_name: 'New playlist name',
      };
      it('should edit list', () => {
        return pactum
          .spec()
          .patch('/list/{id}')
          .withPathParams({
            id: 1,
          })
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .expectStatus(200);
      });
      it('shouldnt edit list', () => {
        return pactum
          .spec()
          .patch('/list/{id}')
          .withPathParams({
            id: 3,
          })
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .expectStatus(403);
      });
    });

    describe('Delete Lists', () => {
      it('should delete list', () => {
        return pactum
          .spec()
          .delete('/list/{id}')
          .withPathParams({
            id: 1,
          })
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(204);
      });

      it('shouldnt delete list', () => {
        return pactum
          .spec()
          .delete('/list/{id}')
          .withPathParams({
            id: 3,
          })
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(403);
      });

      it('should show lists', () => {
        return pactum
          .spec()
          .get('/list')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(200);
      });
    });
  });

  describe('Favs', () => {
    describe('Get Empty Favs', () => {
      it('should show empty favs', () => {
        return pactum
          .spec()
          .get('/favs/{listId}')
          .withPathParams({
            listId: '$S{listId}',
          })
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(200)
          .expectBody([]);
      });
    });

    describe('Create Favs', () => {
      const dto: FavDto = {
        url: 'www.youtube.com/video1',
      };
      it('should create fav', () => {
        return pactum
          .spec()
          .post('/favs/{listId}')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withPathParams({
            listId: '$S{listId}',
          })
          .withBody(dto)
          .expectStatus(201);
      });

      it('should create fav 2', () => {
        return pactum
          .spec()
          .post('/favs/{listId}')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withPathParams({
            listId: '$S{listId}',
          })
          .withBody(dto)
          .expectStatus(201);
      });
    });

    describe('Get Favs', () => {
      it('should show favs', () => {
        return pactum
          .spec()
          .get('/favs/{listId}')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withPathParams({
            listId: '$S{listId}',
          })
          .expectStatus(200)
          .expectJsonLength(2);
      });
    });

    describe('Get Favs by id', () => {
      it('should show favs by id', () => {
        return pactum
          .spec()
          .get('/favs/{listId}/{id}')
          .withPathParams({
            id: 1,
            listId: '$S{listId}',
          })
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(200);
      });

      it('shouldnt show favs by id', () => {
        return pactum
          .spec()
          .get('/favs/{listId}/{id}')
          .withPathParams({
            id: 3,
            listId: '$S{listId}',
          })
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(200);
      });
    });

    describe('Edit Favs', () => {
      const dto: FavDto = {
        url: 'www.youtube.com/video_new',
      };
      it('should edit fav', () => {
        return pactum
          .spec()
          .patch('/favs/{listId}/{id}')
          .withPathParams({
            id: 1,
            listId: '$S{listId}',
          })
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .expectStatus(200);
      });
      it('shouldnt edit fav', () => {
        return pactum
          .spec()
          .patch('/favs/{listId}/{id}')
          .withPathParams({
            id: 3,
            listId: '$S{listId}',
          })
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .expectStatus(403);
      });
    });

    describe('Delete Favs', () => {
      it('should delete fav', () => {
        return pactum
          .spec()
          .delete('/favs/{listId}/{id}')
          .withPathParams({
            id: 1,
            listId: '$S{listId}',
          })
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(204);
      });
      it('shouldnt delete fav', () => {
        return pactum
          .spec()
          .delete('/favs/{listId}/{id}')
          .withPathParams({
            id: 3,
            listId: '$S{listId}',
          })
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(403);
      });

      it('should show favs', () => {
        return pactum
          .spec()
          .get('/favs/{listId}')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withPathParams({
            listId: '$S{listId}',
          })
          .expectStatus(200);
      });
    });
  });
});

// import { Test, TestingModule } from '@nestjs/testing';
// import { INestApplication } from '@nestjs/common';
// import * as request from 'supertest';
// import { AppModule } from './../src/app.module';

// describe('AppController (e2e)', () => {
//   let app: INestApplication;

//   beforeEach(async () => {
//     const moduleFixture: TestingModule = await Test.createTestingModule({
//       imports: [AppModule],
//     }).compile();

//     app = moduleFixture.createNestApplication();
//     await app.init();
//   });

//   it('/ (GET)', () => {
//     return request(app.getHttpServer())
//       .get('/')
//       .expect(200)
//       .expect('Hello World!');
//   });
// });
