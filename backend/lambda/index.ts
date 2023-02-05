import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import * as qs from 'qs';
import fetch from 'cross-fetch';
import { GraphQLError } from 'graphql';
import { gql, request } from 'graphql-request';

const GITHUB_OAUTH_CLIENT_ID = process.env.GITHUB_OAUTH_CLIENT_ID as string;
const GITHUB_OAUTH_CLIENT_SECRET = process.env
  .GITHUB_OAUTH_CLIENT_SECRET as string;

const QUERY = gql`
query {
	viewer {
    databaseId
  }
}
`;

type AccessTokenResponse = {
  access_token: string;
  scope: string;
  token_type: string;
};

type GraphQLResponse =
  | {
      data: {
        viewer: {
          databaseId: number;
        };
      };
    }
  | GraphQLError;

const accessToken = async (code: string): Promise<AccessTokenResponse> => {
  const params = {
    client_id: GITHUB_OAUTH_CLIENT_ID,
    client_secret: GITHUB_OAUTH_CLIENT_SECRET,
    code,
  };
  const queryString = Object.entries(params)
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join('&');
  const response = await fetch(
    `https://github.com/login/oauth/access_token?${queryString}`,
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
      },
    },
  );

  return response.json() as Promise<AccessTokenResponse>;
};

const graphqlRequest = async (token: string): Promise<GraphQLResponse> => {
  return request<GraphQLResponse>('https://api.github.com/graphql', QUERY, {
    requestHeaders: {
      authorization: `token ${token}`,
    },
  });
};

export const handler = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  if (event.body) {
    const code = qs.parse(event.body).code?.toString();
    if (code) {
      const params = {
        client_id: GITHUB_OAUTH_CLIENT_ID,
        client_secret: GITHUB_OAUTH_CLIENT_SECRET,
        code,
      };

      const token = (await accessToken(code)).access_token;

      const response = await graphqlRequest(token);
      if (response instanceof GraphQLError) {
        return {
          statusCode: 500,
          body: JSON.stringify(response),
        };
      }
      const databaseId = response.data.viewer.databaseId;
      return {
        statusCode: 200,
        body: JSON.stringify({
          databaseId,
        }),
      };
    }
  }
  return {
    statusCode: 404,
    body: '',
  };
};
