import { IRouter } from 'src/core/server';
import { schema } from '@kbn/config-schema';

import { wrapIntoCustomErrorResponse } from '../errors';

interface FieldMappingResponse {
  [indexName: string]: {
    mappings: {
      [fieldName: string]: {
        mapping: {
          [fieldName: string]: {
            type: string;
          };
        };
      };
    };
  };
}

export function defineRoutes(router: IRouter) {
  router.get(
    {
      path: '/api/test/example',
      validate: false,
    },
    async (context, request, response) => {
      return response.ok({
        body: {
          time: new Date().toISOString(),
        },
      });
    }
  );

  router.get(
    {
      path: '/api/mappings',
      validate: false,
    },
    async (context, request, response) => {
      try {
        const {
          body: indexMappings,
        } = await context.core.elasticsearch.client.asCurrentUser.indices.getFieldMapping<FieldMappingResponse>(
          {
            index: 'arc-*',
            fields: '*',
            allow_no_indices: false,
            include_defaults: true,
          }
        );
        return response.ok({
          body: indexMappings,
        });
      } catch (error) {
        return response.customError(wrapIntoCustomErrorResponse(error));
      }
    }
  );

  router.post(
    {
      path: '/api/search',
      validate: false
    },
    async (context, request, response) => {

      const client = context.core.elasticsearch.client.asCurrentUser;

      const { body: result } = await client.search({
        // index: request.body.selectedIndex,
        // _source_includes: request.body.selectedFields,
        index: 'arc-*',
        // _source_includes: request.body.selectedFields,
        version: true
      });

      const reply = result.hits.hits;

      return response.ok({
        body: {
          reply,
        },
      });
    }
  );
}
