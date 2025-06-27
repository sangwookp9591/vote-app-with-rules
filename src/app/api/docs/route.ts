import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
import express from 'express';

const app = express();

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Next.js API Example',
    version: '1.0.0',
    description: 'API 문서 예시',
  },
};

const options = {
  swaggerDefinition,
  apis: ['./src/app/api/**/*.ts'], // JSDoc 주석에서 API 문서 추출
};

const swaggerSpec = swaggerJSDoc(options);

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

export const GET = async () => {
  return new Response(swaggerUi.generateHTML(swaggerSpec), {
    headers: { 'Content-Type': 'text/html' },
    status: 200,
  });
};
