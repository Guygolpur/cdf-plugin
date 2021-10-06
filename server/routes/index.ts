import { IRouter } from 'src/core/server';
import { schema } from '@kbn/config-schema';
import { wrapIntoCustomErrorResponse } from '../errors';
import { CoreUsageDataSetup } from 'src/core/server/core_usage_data';
import { object } from 'joi';


interface RouteDependencies {
  coreUsageData: CoreUsageDataSetup;
}

export const registerFindRoute = (router: IRouter, { coreUsageData }: RouteDependencies) => {

  // referance at:
  // \kibana\src\core\server\saved_objects\routes\find.ts
  router.get(
    {
      path: '/_find',
      validate: false,
    },
    async (context, request, response) => {
      try {
        const indexMappings = await context.core.savedObjects.client.find(
          {
            type: 'index-pattern',
            perPage: 10000
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
}


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
      path: '/api/mappings/{indexPattern}',
      validate: {
        params: schema.object({
          indexPattern: schema.string(),
        }),
      },
    },
    async (context, request, response) => {
      try {
        const {
          body: indexMappings,
        } = await context.core.elasticsearch.client.asCurrentUser.indices.getFieldMapping<FieldMappingResponse>(
          {
            index: request.params.indexPattern,
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
          indexPattern: schema.string()
        }),
      },
    },
    async (context, request, res) => {
      const client = context.core.elasticsearch.client.asCurrentUser;

      const tmp = request.body.data
      const index = request.body.indexPattern
      try {
        const response = await client.search({
          index,
          body: tmp
        });

        return res.ok({ body: response.body });

      } catch (err: any) {
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
