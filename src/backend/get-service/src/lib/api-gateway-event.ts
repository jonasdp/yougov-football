export interface APIGatewayEvent {
  body: string;
  httpMethod: string;
  pathParameters: { [name: string]: string } | null;
}