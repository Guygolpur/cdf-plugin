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
  
  //  referance at:
  //  \kibana\x-pack\plugins\security\server\routes\indices\get_fields.ts
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

  //  referance at:
  //  \kibana\src\plugins\index_pattern_management\server\routes\preview_scripted_field.ts
  //  \kibana\examples\search_examples\server\routes\server_search_route.ts
  router.post(
    {
      path: '/api/search',
      validate: {
        body: schema.object({
          data: schema.maybe(schema.object({}, { unknowns: 'allow' })),
        }),
      },
    },
    async (context, request, res) => {
      const client = context.core.elasticsearch.client.asCurrentUser;

      const tmp = request.body.data
      const index = 'arc-*'
      try {
        const response = await client.search({
          index,
          body: tmp
        });

        return res.ok({ body: response.body });

      } catch (err) {
        return res.customError({
          statusCode: err.statusCode || 500,
          body: {
            message: err.message,
            attributes: {
              error: err.body?.error || err.message,
            },
          },
        });
      }
    }
  )
}
