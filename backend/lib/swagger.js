const swaggerJsDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'PAW Restaurante API',
      version: '1.0.0',
      description: 'API para gestão de restaurantes, utilizadores, encomendas e mais.'
    },
    tags: [
      {
        name: "Auth",
        description: "Operações de login, registo e autenticação de utilizadores",
      },
      {
        name: "Admin",
        description: "Funcionalidades de administração e controlo do sistema",
      },
      {
        name: "Restaurant - Public",
        description: "Pesquisa e visualização dos restaurantes",
      },
      {
        name: "Restaurant",
        description: "Criação e edição de perfis de restaurantes",
      },
      {
        name: "Menu",
        description: "Criação, edição e organização de menus",
      },
      {
        name: "MenuItem",
        description: "Adição, modificação e remoção de pratos individuais",
      },
      {
        name: "Cart",
        description: "Operações do carrinho de compras e seleção de itens",
      },
      {
        name: "Order",
        description: "Processamento, acompanhamento e histórico de pedidos",
      },
      {
        name: "Profile",
        description: "Gestão do perfil de utilizador",
      },
    ],
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor local'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    paths: {
      '/auth/signup': {
        post: {
          tags: ['Auth'],
          summary: 'Registar um novo utilizador',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    username: { type: 'string', example: 'myuser' },
                    password: { type: 'string', example: 'mypassword123' },
                    email: { type: 'string', example: 'user@email.com' },
                    role: { type: 'string', enum: ['customer', 'restaurant'], example: 'restaurant' },
                    firstName: { type: 'string', example: 'My' },
                    lastName: { type: 'string', example: 'User' },
                    street: { type: 'string', example: 'Street example, 01' },
                    city: { type: 'string', example: 'Lisbon' },
                    postalCode: { type: 'string', example: '4213-123' }
                  },
                  required: ['username', 'password', 'email', 'role', 'firstName', 'lastName', 'street', 'city', 'postalCode']
                }
              }
            }
          },
          responses: {
            201: {
              description: 'Conta criada com sucesso'
            },
            400: {
              description: 'Erro de validação dos dados'
            },
            409: {
              description: 'Username ou email já existe'
            },
            500: {
              description: 'Erro interno do servidor'
            }
          }
        }
      },
      '/auth/login': {
        post: {
          tags: ['Auth'],
          summary: 'Autenticar utilizador e obter token JWT',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    username: { type: 'string', example: 'myuser' },
                    password: { type: 'string', example: 'mypassword123' }
                  },
                  required: ['username', 'password']
                }
              }
            }
          },
          responses: {
            200: {
              description: 'Autenticação bem sucedida, token devolvido'
            },
            400: {
              description: 'Username e password são obrigatórios'
            },
            401: {
              description: 'Username ou password inválidos'
            },
            500: {
              description: 'Erro interno do servidor'
            }
          }
        }
      },
      '/profile': {
        get: {
          tags: ['Profile'],
          summary: 'Obter perfil do utilizador autenticado',
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              description: 'Perfil do utilizador',
              content: {
                'application/json': {
                  example: {
                    _id: "user_id",
                    username: "user123",
                    email: "user@example.com",
                    firstName: "João",
                    lastName: "Silva",
                    profileImage: "http://localhost:3000/uploads/profile.jpg"
                  }
                }
              }
            },
            401: { description: 'Não autorizado' },
            404: { description: 'Utilizador não encontrado' },
            500: { description: 'Erro interno do servidor' }
          }
        },
        put: {
          tags: ['Profile'],
          summary: 'Atualizar perfil do utilizador',
          security: [{ bearerAuth: [] }],
          requestBody: {
            content: {
              'multipart/form-data': {
                schema: {
                  type: 'object',
                  properties: {
                    username: { type: 'string' },
                    email: { type: 'string' },
                    firstName: { type: 'string' },
                    lastName: { type: 'string' },
                    address_street: { type: 'string' },
                    address_city: { type: 'string' },
                    address_postalCode: { type: 'string' },
                    profileImage: { type: 'string', format: 'binary' },
                    removeImage: { type: 'string', enum: ['true', 'false'] }
                  }
                }
              }
            }
          },
          responses: {
            200: {
              description: 'Perfil atualizado com sucesso',
              content: {
                'application/json': {
                  example: {
                    message: 'Profile updated successfully.',
                    user: {
                      _id: "user_id",
                      username: "user123",
                      email: "user@example.com",
                      profileImage: "/uploads/new-image.jpg"
                    }
                  }
                }
              }
            },
            400: { description: 'Erro de validação' },
            401: { description: 'Não autorizado' }
          }
        }
      },
      '/profile/password': {
        put: {
          tags: ['Profile'],
          summary: 'Atualizar password do utilizador',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    currentPassword: { type: 'string' },
                    newPassword: { type: 'string' },
                    confirmPassword: { type: 'string' }
                  },
                  required: ['currentPassword', 'newPassword', 'confirmPassword']
                }
              }
            }
          },
          responses: {
            200: { description: 'Password alterada com sucesso' },
            400: { description: 'Erro na alteração da password' },
            401: { description: 'Não autorizado' }
          }
        }
      },
      '/owner/restaurants': {
        get: {
          tags: ['Restaurant'],
          summary: 'Listar restaurantes do utilizador autenticado',
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: 'Lista de restaurantes' },
            401: { description: 'Não autorizado' }
          }
        },
        post: {
          tags: ['Restaurant'],
          summary: 'Criar um restaurante',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    name: { type: 'string' },
                    address_street: { type: 'string' },
                    address_city: { type: 'string' },
                    address_postcode: { type: 'string' },
                    contact_phone: { type: 'string' },
                    contact_email: { type: 'string' }
                  },
                  required: ['name', 'address_street', 'address_city', 'address_postcode', 'contact_phone']
                }
              }
            }
          },
          responses: {
            201: { description: 'Restaurante criado com sucesso' },
            400: { description: 'Erro de validação' },
            401: { description: 'Não autorizado' }
          }
        }
      },
      '/owner/restaurants/{id}': {
        get: {
          tags: ['Restaurant'],
          summary: 'Obter um restaurante pelo ID',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'string' }
            }
          ],
          responses: {
            200: { description: 'Restaurante encontrado' },
            401: { description: 'Não autorizado' },
            404: { description: 'Restaurante não encontrado' }
          }
        },
        put: {
          tags: ['Restaurant'],
          summary: 'Atualizar restaurante',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'string' }
            }
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    name: { type: 'string' },
                    address_street: { type: 'string' },
                    address_city: { type: 'string' },
                    address_postcode: { type: 'string' },
                    contact_phone: { type: 'string' },
                    contact_email: { type: 'string' },
                    settings_preparationTime: { type: 'number' },
                    settings_deliveryTime: { type: 'number' }
                  },
                  required: ['name', 'address_street', 'address_city', 'address_postcode', 'contact_phone', 'settings_preparationTime', 'settings_deliveryTime']
                }
              }
            }
          },
          responses: {
            200: { description: 'Restaurante atualizado' },
            400: { description: 'Erro de validação' },
            401: { description: 'Não autorizado' },
            404: { description: 'Restaurante não encontrado' }
          }
        },
        delete: {
          tags: ['Restaurant'],
          summary: 'Remover restaurante',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'string' }
            }
          ],
          responses: {
            200: { description: 'Restaurante removido com sucesso' },
            401: { description: 'Não autorizado' },
            404: { description: 'Restaurante não encontrado' }
          }
        }
      },
      '/owner/restaurants/{restaurantId}/menus': {
        get: {
          tags: ['Menu'],
          summary: 'Listar menus de um restaurante',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'restaurantId',
              in: 'path',
              required: true,
              schema: { type: 'string' }
            }
          ],
          responses: {
            200: { description: 'Lista de menus' },
            400: { description: 'ID de restaurante inválido' },
            401: { description: 'Não autorizado' },
            404: { description: 'Restaurante não encontrado' }
          }
        },
        post: {
          tags: ['Menu'],
          summary: 'Criar um novo menu num restaurante',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'restaurantId',
              in: 'path',
              required: true,
              schema: { type: 'string' }
            }
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    name: { type: 'string' },
                    description: { type: 'string' },
                    active: { type: 'boolean' }
                  },
                  required: ['name', 'description']
                }
              }
            }
          },
          responses: {
            201: { description: 'Menu criado com sucesso' },
            400: { description: 'Erro de validação ou ID inválido' },
            401: { description: 'Não autorizado' },
            404: { description: 'Restaurante não encontrado' }
          }
        }
      },
      '/owner/restaurants/{restaurantId}/menus/{menuId}': {
        get: {
          tags: ['Menu'],
          summary: 'Obter um menu por ID',
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: 'restaurantId', in: 'path', required: true, schema: { type: 'string' } },
            { name: 'menuId', in: 'path', required: true, schema: { type: 'string' } }
          ],
          responses: {
            200: { description: 'Menu encontrado' },
            401: { description: 'Não autorizado' },
            404: { description: 'Menu ou restaurante não encontrado' }
          }
        },
        put: {
          tags: ['Menu'],
          summary: 'Atualizar um menu',
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: 'restaurantId', in: 'path', required: true, schema: { type: 'string' } },
            { name: 'menuId', in: 'path', required: true, schema: { type: 'string' } }
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    name: { type: 'string' },
                    description: { type: 'string' }
                  },
                  required: ['name', 'description']
                }
              }
            }
          },
          responses: {
            200: { description: 'Menu atualizado com sucesso' },
            400: { description: 'Erro de validação ou ID inválido' },
            401: { description: 'Não autorizado' },
            404: { description: 'Menu ou restaurante não encontrado' }
          }
        },
        delete: {
          tags: ['Menu'],
          summary: 'Eliminar um menu',
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: 'restaurantId', in: 'path', required: true, schema: { type: 'string' } },
            { name: 'menuId', in: 'path', required: true, schema: { type: 'string' } }
          ],
          responses: {
            200: { description: 'Menu eliminado com sucesso' },
            400: { description: 'ID inválido' },
            401: { description: 'Não autorizado' },
            404: { description: 'Menu ou restaurante não encontrado' }
          }
        }
      },
      '/owner/restaurants/{restaurantId}/menus/{menuId}/items': {
        get: {
          tags: ['MenuItem'],
          summary: 'Listar itens de menu de um menu específico',
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: 'restaurantId', in: 'path', required: true, schema: { type: 'string' } },
            { name: 'menuId', in: 'path', required: true, schema: { type: 'string' } }
          ],
          responses: {
            200: { description: 'Lista de itens de menu' },
            400: { description: 'ID de menu inválido' },
            401: { description: 'Não autorizado' },
            404: { description: 'Menu ou restaurante não encontrado' }
          }
        },
        post: {
          tags: ['MenuItem'],
          summary: 'Criar novo item de menu',
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: 'restaurantId', in: 'path', required: true, schema: { type: 'string' } },
            { name: 'menuId', in: 'path', required: true, schema: { type: 'string' } }
          ],
          requestBody: {
            required: true,
            content: {
              'multipart/form-data': {
                schema: {
                  type: 'object',
                  properties: {
                    name: { type: 'string' },
                    description: { type: 'string' },
                    category: { type: 'string' },
                    available: { type: 'boolean' },
                    price: { type: 'number' },
                    itemInfo_calories: { type: 'number' },
                    itemInfo_proteins: { type: 'number' },
                    itemInfo_fats: { type: 'number' },
                    itemInfo_carbohydrates: { type: 'number' },
                    itemInfo_fiber: { type: 'number' },
                    itemInfo_sodium: { type: 'number' },
                    image: { type: 'string', format: 'binary' }
                  },
                  required: ['name', 'description', 'price', 'image']
                }
              }
            }
          },
          responses: {
            201: { description: 'Item de menu criado com sucesso' },
            400: { description: 'Erro de validação ou ID inválido' },
            401: { description: 'Não autorizado' },
            404: { description: 'Menu ou restaurante não encontrado' }
          }
        }
      },
      '/owner/restaurants/{restaurantId}/menus/{menuId}/items/{itemId}': {
        get: {
          tags: ['MenuItem'],
          summary: 'Obter um item de menu por ID',
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: 'restaurantId', in: 'path', required: true, schema: { type: 'string' } },
            { name: 'menuId', in: 'path', required: true, schema: { type: 'string' } },
            { name: 'itemId', in: 'path', required: true, schema: { type: 'string' } }
          ],
          responses: {
            200: { description: 'Item de menu encontrado' },
            400: { description: 'ID inválido' },
            401: { description: 'Não autorizado' },
            404: { description: 'Item, menu ou restaurante não encontrado' }
          }
        },
        put: {
          tags: ['MenuItem'],
          summary: 'Atualizar um item de menu',
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: 'restaurantId', in: 'path', required: true, schema: { type: 'string' } },
            { name: 'menuId', in: 'path', required: true, schema: { type: 'string' } },
            { name: 'itemId', in: 'path', required: true, schema: { type: 'string' } }
          ],
          requestBody: {
            required: true,
            content: {
              'multipart/form-data': {
                schema: {
                  type: 'object',
                  properties: {
                    name: { type: 'string' },
                    description: { type: 'string' },
                    category: { type: 'string' },
                    available: { type: 'boolean' },
                    price: { type: 'number' },
                    itemInfo_calories: { type: 'number' },
                    itemInfo_proteins: { type: 'number' },
                    itemInfo_fats: { type: 'number' },
                    itemInfo_carbohydrates: { type: 'number' },
                    itemInfo_fiber: { type: 'number' },
                    itemInfo_sodium: { type: 'number' },
                    image: { type: 'string', format: 'binary' }
                  },
                  required: ['name', 'description', 'price']
                }
              }
            }
          },
          responses: {
            200: { description: 'Item de menu atualizado com sucesso' },
            400: { description: 'Erro de validação ou ID inválido' },
            401: { description: 'Não autorizado' },
            404: { description: 'Item, menu ou restaurante não encontrado' }
          }
        },
        delete: {
          tags: ['MenuItem'],
          summary: 'Eliminar um item de menu',
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: 'restaurantId', in: 'path', required: true, schema: { type: 'string' } },
            { name: 'menuId', in: 'path', required: true, schema: { type: 'string' } },
            { name: 'itemId', in: 'path', required: true, schema: { type: 'string' } }
          ],
          responses: {
            200: { description: 'Item de menu eliminado com sucesso' },
            400: { description: 'ID inválido' },
            401: { description: 'Não autorizado' },
            404: { description: 'Item, menu ou restaurante não encontrado' }
          }
        }
      },
      '/cart': {
        get: {
          tags: ['Cart'],
          summary: 'Obter o carrinho do utilizador autenticado',
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: 'Carrinho retornado com sucesso' },
            401: { description: 'Não autorizado' },
            500: { description: 'Erro interno do servidor' }
          }
        },
        delete: {
          tags: ['Cart'],
          summary: 'Limpar o carrinho do utilizador autenticado',
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: 'Carrinho limpo com sucesso' },
            401: { description: 'Não autorizado' },
            404: { description: 'Carrinho não encontrado' },
            500: { description: 'Erro interno do servidor' }
          }
        }
      },

      '/cart/items': {
        post: {
          tags: ['Cart'],
          summary: 'Adicionar item ao carrinho',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    menuItemId: { type: 'string' },
                    quantity: { type: 'integer' }
                  },
                  required: ['menuItemId', 'quantity']
                }
              }
            }
          },
          responses: {
            200: { description: 'Item adicionado com sucesso' },
            400: { description: 'Dados inválidos ou múltiplos restaurantes no carrinho' },
            401: { description: 'Não autorizado' },
            404: { description: 'Item ou menu não encontrado' },
            500: { description: 'Erro ao adicionar item ao carrinho' }
          }
        }
      },

      '/cart/items/{menuItemId}': {
        put: {
          tags: ['Cart'],
          summary: 'Atualizar quantidade de um item no carrinho',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'menuItemId',
              in: 'path',
              required: true,
              schema: { type: 'string' }
            }
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    quantity: { type: 'integer' }
                  },
                  required: ['quantity']
                }
              }
            }
          },
          responses: {
            200: { description: 'Item atualizado com sucesso' },
            400: { description: 'ID ou quantidade inválidos' },
            401: { description: 'Não autorizado' },
            404: { description: 'Carrinho ou item não encontrado' },
            500: { description: 'Erro ao atualizar item' }
          }
        },
        delete: {
          tags: ['Cart'],
          summary: 'Remover item do carrinho',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'menuItemId',
              in: 'path',
              required: true,
              schema: { type: 'string' }
            }
          ],
          responses: {
            200: { description: 'Item removido com sucesso' },
            400: { description: 'ID inválido' },
            401: { description: 'Não autorizado' },
            404: { description: 'Carrinho ou item não encontrado' },
            500: { description: 'Erro ao remover item' }
          }
        }
      },

      '/cart/submit': {
        post: {
          tags: ['Cart'],
          summary: 'Submeter o carrinho como uma encomenda',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    deliveryDetails: { type: 'string' },
                    contact: { type: 'string' },
                    type: { type: 'string' },
                    paymentMethod: { type: 'string' },
                    citizenCardNumber: { type: 'string' }
                  },
                  required: ['type', 'paymentMethod']
                }
              }
            }
          },
          responses: {
            200: { description: 'Encomenda submetida com sucesso' },
            400: { description: 'Carrinho vazio ou múltiplos restaurantes' },
            401: { description: 'Não autorizado' },
            500: { description: 'Erro ao submeter o carrinho' }
          }
        }
      },
      '/order/user': {
        get: {
          tags: ['Order'],
          summary: 'Listar encomendas do utilizador autenticado',
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: 'Encomendas do utilizador retornadas com sucesso' },
            401: { description: 'Não autorizado' },
            500: { description: 'Erro ao obter histórico de encomendas' }
          }
        }
      },

      '/order/restaurant/{restaurantId}': {
        get: {
          tags: ['Order'],
          summary: 'Listar encomendas de um restaurante',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'restaurantId',
              in: 'path',
              required: true,
              schema: { type: 'string' }
            }
          ],
          responses: {
            200: { description: 'Encomendas do restaurante retornadas com sucesso' },
            401: { description: 'Não autorizado' },
            500: { description: 'Erro ao obter encomendas do restaurante' }
          }
        }
      },

      '/order/{id}': {
        get: {
          tags: ['Order'],
          summary: 'Obter detalhes de uma encomenda pelo ID',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'string' }
            }
          ],
          responses: {
            200: { description: 'Detalhes da encomenda retornados com sucesso' },
            403: { description: 'Acesso negado à encomenda' },
            404: { description: 'Encomenda não encontrada' },
            500: { description: 'Erro ao obter encomenda' }
          }
        }
      },

      '/order/{id}/cancel': {
        put: {
          tags: ['Order'],
          summary: 'Cancelar encomenda',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'string' }
            }
          ],
          responses: {
            200: { description: 'Encomenda cancelada com sucesso' },
            400: { description: 'Cancelamento inválido (tempo excedido ou estado inválido)' },
            403: { description: 'Não autorizado' },
            404: { description: 'Encomenda não encontrada' },
            500: { description: 'Erro ao cancelar encomenda' }
          }
        }
      },

      '/order/{id}/status': {
        put: {
          tags: ['Order'],
          summary: 'Atualizar estado de uma encomenda',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'string' }
            }
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: {
                      type: 'string',
                      enum: ['pending', 'confirmed', 'inProgress', 'outForDelivery', 'delivered']
                    }
                  },
                  required: ['status']
                }
              }
            }
          },
          responses: {
            200: { description: 'Estado atualizado com sucesso' },
            400: { description: 'Estado inválido' },
            404: { description: 'Encomenda não encontrada' },
            500: { description: 'Erro ao atualizar estado da encomenda' }
          }
        }
      },
      '/admin/dashboard': {
        get: {
          tags: ['Admin'],
          summary: 'Obter estatísticas da plataforma',
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: 'Estatísticas obtidas com sucesso' },
            401: { description: 'Não autorizado' },
            500: { description: 'Erro ao obter estatísticas' }
          }
        }
      },

      '/admin/users/pending': {
        get: {
          tags: ['Admin'],
          summary: 'Listar utilizadores com role restaurante pendentes de validação',
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: 'Lista de utilizadores pendentes' },
            401: { description: 'Não autorizado' },
            500: { description: 'Erro ao obter utilizadores pendentes' }
          }
        }
      },

      '/admin/users/{id}/validate': {
        post: {
          tags: ['Admin'],
          summary: 'Validar utilizador com role restaurante',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'string' }
            }
          ],
          responses: {
            200: { description: 'Utilizador validado com sucesso' },
            400: { description: 'Utilizador ou role inválido' },
            401: { description: 'Não autorizado' },
            500: { description: 'Erro ao validar utilizador' }
          }
        }
      },

      '/admin/restaurants': {
        get: {
          tags: ['Admin'],
          summary: 'Listar todos os restaurantes',
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: 'Lista de restaurantes' },
            401: { description: 'Não autorizado' },
            500: { description: 'Erro ao obter restaurantes' }
          }
        },
        post: {
          tags: ['Admin'],
          summary: 'Adicionar novo restaurante',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    name: { type: 'string' },
                    address_street: { type: 'string' },
                    address_city: { type: 'string' },
                    address_postcode: { type: 'string' },
                    contact_phone: { type: 'string' },
                    contact_email: { type: 'string' },
                    owner: { type: 'string' }
                  },
                  required: ['name', 'address_street', 'address_city', 'address_postcode', 'contact_phone', 'owner']
                }
              }
            }
          },
          responses: {
            201: { description: 'Restaurante adicionado com sucesso' },
            401: { description: 'Não autorizado' },
            500: { description: 'Erro ao adicionar restaurante' }
          }
        }
      },

      '/admin/restaurants/validated': {
        get: {
          tags: ['Admin'],
          summary: 'Listar restaurantes validados',
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: 'Lista de restaurantes validados' },
            401: { description: 'Não autorizado' },
            500: { description: 'Erro ao obter restaurantes validados' }
          }
        }
      },

      '/admin/restaurants/{id}': {
        put: {
          tags: ['Admin'],
          summary: 'Editar restaurante',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'string' }
            }
          ],
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    name: { type: 'string' },
                    address: {
                      type: 'object',
                      properties: {
                        street: { type: 'string' },
                        city: { type: 'string' },
                        postcode: { type: 'string' }
                      }
                    },
                    contact: {
                      type: 'object',
                      properties: {
                        phone: { type: 'string' },
                        email: { type: 'string' }
                      }
                    }
                  }
                }
              }
            }
          },
          responses: {
            200: { description: 'Restaurante atualizado com sucesso' },
            401: { description: 'Não autorizado' },
            404: { description: 'Restaurante não encontrado' },
            500: { description: 'Erro ao atualizar restaurante' }
          }
        },
        delete: {
          tags: ['Admin'],
          summary: 'Remover restaurante',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'string' }
            }
          ],
          responses: {
            200: { description: 'Restaurante removido com sucesso' },
            401: { description: 'Não autorizado' },
            500: { description: 'Erro ao remover restaurante' }
          }
        }
      },
      '/restaurants': {
        get: {
          tags: ['Restaurant - Public'],
          summary: 'Obter todos os restaurantes',
          responses: {
            200: { description: 'Lista de restaurantes' },
            500: { description: 'Erro interno do servidor' }
          }
        }
      },

      '/restaurants/search': {
        get: {
          tags: ['Restaurant - Public'],
          summary: 'Pesquisar restaurantes por nome e/ou cidade',
          parameters: [
            {
              name: 'name',
              in: 'query',
              schema: { type: 'string' },
              required: false,
              description: 'Nome parcial ou completo do restaurante'
            },
            {
              name: 'city',
              in: 'query',
              schema: { type: 'string' },
              required: false,
              description: 'Nome da cidade onde se localiza o restaurante'
            }
          ],
          responses: {
            200: { description: 'Lista de restaurantes que correspondem aos critérios' },
            500: { description: 'Erro interno do servidor' }
          }
        }
      },

      '/restaurants/{id}': {
        get: {
          tags: ['Restaurant - Public'],
          summary: 'Obter detalhes de um restaurante específico e os seus menus ativos',
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'string' },
              description: 'ID do restaurante'
            }
          ],
          responses: {
            200: { description: 'Restaurante encontrado com menus e itens' },
            404: { description: 'Restaurante não encontrado' },
            500: { description: 'Erro interno do servidor' }
          }
        }
      },
    },
  },

  apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJsDoc(options);

module.exports = swaggerSpec;
