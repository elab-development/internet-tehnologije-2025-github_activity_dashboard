import swaggerJsdoc from 'swagger-jsdoc'

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Podcast Platforma API',
      version: '1.0.0',
      description: 'REST API za podcast platformu - seminarski rad Internet Tehnologije 2025',
    },
    servers: [
      { url: 'http://localhost:3000', description: 'Development server' },
      { url: 'http://ec2-3-68-49-44.eu-central-1.compute.amazonaws.com:3000', description: 'Production server' },
    ],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'next-auth.session-token',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            ime: { type: 'string' },
            email: { type: 'string', format: 'email' },
            role: { type: 'string', enum: ['SLUSALAC', 'KREATOR', 'ADMIN'] },
            statusNaloga: { type: 'string', enum: ['AKTIVAN', 'SUSPENDOVAN', 'OBRISAN'] },
            datumRegistracije: { type: 'string', format: 'date-time' },
          },
        },
        Podcast: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            naziv: { type: 'string' },
            opis: { type: 'string' },
            kategorija: { type: 'string', enum: ['TEHNOLOGIJA', 'EDUKACIJA', 'ZABAVA', 'BIZNIS', 'OSTALO'] },
            coverImageUrl: { type: 'string', nullable: true },
            datumKreiranja: { type: 'string', format: 'date-time' },
            creatorId: { type: 'string', format: 'uuid' },
          },
        },
        Episode: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            naslov: { type: 'string' },
            opis: { type: 'string' },
            audioUrl: { type: 'string' },
            trajanje: { type: 'integer', description: 'Trajanje u sekundama' },
            datumObjave: { type: 'string', format: 'date-time' },
            podcastId: { type: 'string', format: 'uuid' },
          },
        },
        Comment: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            sadrzaj: { type: 'string' },
            datumKreiranja: { type: 'string', format: 'date-time' },
            userId: { type: 'string', format: 'uuid' },
            episodeId: { type: 'string', format: 'uuid' },
          },
        },
        Subscription: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            userId: { type: 'string', format: 'uuid' },
            podcastId: { type: 'string', format: 'uuid' },
            datumPretplate: { type: 'string', format: 'date-time' },
          },
        },
        Favorite: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            userId: { type: 'string', format: 'uuid' },
            episodeId: { type: 'string', format: 'uuid' },
            datumDodavanja: { type: 'string', format: 'date-time' },
          },
        },
        Error: {
          type: 'object',
          properties: {
            error: { type: 'string' },
          },
        },
      },
    },
    paths: {
      '/api/auth/register': {
        post: {
          tags: ['Auth'],
          summary: 'Registracija novog korisnika',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['ime', 'email', 'password'],
                  properties: {
                    ime: { type: 'string' },
                    email: { type: 'string', format: 'email' },
                    password: { type: 'string', minLength: 6 },
                    role: { type: 'string', enum: ['SLUSALAC', 'KREATOR'], default: 'SLUSALAC' },
                  },
                },
              },
            },
          },
          responses: {
            201: { description: 'Korisnik uspešno kreiran' },
            400: { description: 'Nedostaju polja' },
            409: { description: 'Email već postoji' },
            500: { description: 'Greška na serveru' },
          },
        },
      },
      '/api/podcasts': {
        get: {
          tags: ['Podcasts'],
          summary: 'Lista svih podkasta',
          parameters: [
            { name: 'search', in: 'query', schema: { type: 'string' }, description: 'Pretraga po nazivu/opisu' },
            { name: 'kategorija', in: 'query', schema: { type: 'string', enum: ['TEHNOLOGIJA', 'EDUKACIJA', 'ZABAVA', 'BIZNIS', 'OSTALO'] } },
          ],
          responses: {
            200: { description: 'Lista podkasta', content: { 'application/json': { schema: { type: 'array', items: { '$ref': '#/components/schemas/Podcast' } } } } },
          },
        },
        post: {
          tags: ['Podcasts'],
          summary: 'Kreiranje novog podkasta (samo KREATOR)',
          security: [{ cookieAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['naziv', 'opis', 'kategorija'],
                  properties: {
                    naziv: { type: 'string' },
                    opis: { type: 'string' },
                    kategorija: { type: 'string', enum: ['TEHNOLOGIJA', 'EDUKACIJA', 'ZABAVA', 'BIZNIS', 'OSTALO'] },
                    coverImageUrl: { type: 'string', nullable: true },
                  },
                },
              },
            },
          },
          responses: {
            201: { description: 'Podkast kreiran' },
            401: { description: 'Nije ulogovan' },
            403: { description: 'Nije KREATOR' },
          },
        },
      },
      '/api/podcasts/{id}': {
        get: {
          tags: ['Podcasts'],
          summary: 'Detalji podkasta sa epizodama',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
          responses: {
            200: { description: 'Podkast detalji' },
            404: { description: 'Podkast nije pronađen' },
          },
        },
        put: {
          tags: ['Podcasts'],
          summary: 'Izmena podkasta (vlasnik ili ADMIN)',
          security: [{ cookieAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    naziv: { type: 'string' },
                    opis: { type: 'string' },
                    kategorija: { type: 'string' },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: 'Podkast ažuriran' },
            401: { description: 'Nije ulogovan' },
            403: { description: 'Nema dozvolu' },
            404: { description: 'Nije pronađen' },
          },
        },
        delete: {
          tags: ['Podcasts'],
          summary: 'Brisanje podkasta (vlasnik ili ADMIN)',
          security: [{ cookieAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
          responses: {
            200: { description: 'Podkast obrisan' },
            401: { description: 'Nije ulogovan' },
            403: { description: 'Nema dozvolu' },
            404: { description: 'Nije pronađen' },
          },
        },
      },
      '/api/podcasts/{id}/episodes': {
        get: {
          tags: ['Episodes'],
          summary: 'Lista epizoda podkasta',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
          responses: {
            200: { description: 'Lista epizoda' },
          },
        },
        post: {
          tags: ['Episodes'],
          summary: 'Dodavanje epizode (vlasnik podkasta)',
          security: [{ cookieAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['naslov', 'opis', 'audioUrl', 'trajanje'],
                  properties: {
                    naslov: { type: 'string' },
                    opis: { type: 'string' },
                    audioUrl: { type: 'string' },
                    trajanje: { type: 'integer' },
                  },
                },
              },
            },
          },
          responses: {
            201: { description: 'Epizoda kreirana' },
            401: { description: 'Nije ulogovan' },
            403: { description: 'Nema dozvolu' },
          },
        },
      },
      '/api/episodes/{id}': {
        get: {
          tags: ['Episodes'],
          summary: 'Detalji epizode sa komentarima',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
          responses: {
            200: { description: 'Epizoda detalji' },
            404: { description: 'Epizoda nije pronađena' },
          },
        },
        put: {
          tags: ['Episodes'],
          summary: 'Izmena epizode (vlasnik podkasta ili ADMIN)',
          security: [{ cookieAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
          responses: {
            200: { description: 'Epizoda ažurirana' },
            401: { description: 'Nije ulogovan' },
            403: { description: 'Nema dozvolu' },
          },
        },
        delete: {
          tags: ['Episodes'],
          summary: 'Brisanje epizode (vlasnik podkasta ili ADMIN)',
          security: [{ cookieAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
          responses: {
            200: { description: 'Epizoda obrisana' },
            401: { description: 'Nije ulogovan' },
            403: { description: 'Nema dozvolu' },
          },
        },
      },
      '/api/episodes/{id}/comments': {
        post: {
          tags: ['Comments'],
          summary: 'Dodavanje komentara na epizodu',
          security: [{ cookieAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['sadrzaj'],
                  properties: {
                    sadrzaj: { type: 'string' },
                  },
                },
              },
            },
          },
          responses: {
            201: { description: 'Komentar dodat' },
            401: { description: 'Nije ulogovan' },
          },
        },
      },
      '/api/comments/{id}': {
        delete: {
          tags: ['Comments'],
          summary: 'Brisanje komentara (autor ili ADMIN)',
          security: [{ cookieAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
          responses: {
            200: { description: 'Komentar obrisan' },
            401: { description: 'Nije ulogovan' },
            403: { description: 'Nema dozvolu' },
            404: { description: 'Nije pronađen' },
          },
        },
      },
      '/api/podcasts/{id}/subscribe': {
        get: {
          tags: ['Subscriptions'],
          summary: 'Provjera pretplate',
          security: [{ cookieAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
          responses: {
            200: { description: '{ subscribed: boolean }' },
          },
        },
        post: {
          tags: ['Subscriptions'],
          summary: 'Pretplata na podkast',
          security: [{ cookieAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
          responses: {
            200: { description: '{ subscribed: true }' },
            401: { description: 'Nije ulogovan' },
          },
        },
        delete: {
          tags: ['Subscriptions'],
          summary: 'Otkazivanje pretplate',
          security: [{ cookieAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
          responses: {
            200: { description: '{ subscribed: false }' },
            401: { description: 'Nije ulogovan' },
          },
        },
      },
      '/api/episodes/{id}/favorite': {
        get: {
          tags: ['Favorites'],
          summary: 'Provjera omiljene epizode',
          security: [{ cookieAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
          responses: {
            200: { description: '{ favorited: boolean }' },
          },
        },
        post: {
          tags: ['Favorites'],
          summary: 'Dodavanje u omiljene',
          security: [{ cookieAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
          responses: {
            200: { description: '{ favorited: true }' },
            401: { description: 'Nije ulogovan' },
          },
        },
        delete: {
          tags: ['Favorites'],
          summary: 'Uklanjanje iz omiljenih',
          security: [{ cookieAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
          responses: {
            200: { description: '{ favorited: false }' },
            401: { description: 'Nije ulogovan' },
          },
        },
      },
      '/api/upload': {
        post: {
          tags: ['Upload'],
          summary: 'Upload audio ili cover slike na AWS S3',
          security: [{ cookieAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'multipart/form-data': {
                schema: {
                  type: 'object',
                  properties: {
                    file: { type: 'string', format: 'binary' },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: '{ url: "https://s3.amazonaws.com/..." }' },
            400: { description: 'Fajl nije priložen ili nepodržan format' },
            401: { description: 'Nije ulogovan' },
          },
        },
      },
      '/api/users': {
        get: {
          tags: ['Admin'],
          summary: 'Lista svih korisnika (samo ADMIN)',
          security: [{ cookieAuth: [] }],
          responses: {
            200: { description: 'Lista korisnika' },
            403: { description: 'Nije ADMIN' },
          },
        },
      },
      '/api/users/{id}': {
        patch: {
          tags: ['Admin'],
          summary: 'Izmena korisnika - role/status (samo ADMIN)',
          security: [{ cookieAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    statusNaloga: { type: 'string', enum: ['AKTIVAN', 'SUSPENDOVAN', 'OBRISAN'] },
                    role: { type: 'string', enum: ['SLUSALAC', 'KREATOR', 'ADMIN'] },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: 'Korisnik ažuriran' },
            400: { description: 'Ne možete suspendovati sopstveni nalog' },
            403: { description: 'Nije ADMIN' },
          },
        },
      },
      '/api/admin/stats': {
        get: {
          tags: ['Admin'],
          summary: 'Statistike platforme (samo ADMIN)',
          security: [{ cookieAuth: [] }],
          responses: {
            200: {
              description: 'Statistike',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      podcastsByCategory: { type: 'array' },
                      topPodcasts: { type: 'array' },
                      totals: { type: 'object' },
                    },
                  },
                },
              },
            },
            403: { description: 'Nije ADMIN' },
          },
        },
      },
    },
  },
  apis: [],
}

export const swaggerSpec = swaggerJsdoc(options)
