import { IRouter } from 'src/core/server';
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
        debugger
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

        const fields = Array.from(
          new Set(
            Object.values(indexMappings).flatMap((indexMapping) => {
              let objNodeSub: any;
              return Object.keys(indexMapping.mappings).map((fieldName) => {
                const mappingValue = Object.values(indexMapping.mappings[fieldName].mapping);
                objNodeSub = {
                  'value': fieldName, 'type': mappingValue[0]?.type
                };
                return objNodeSub;
              })
            })
          )
        );

        return response.ok({
          body: fields,
        });
      } catch (error) {
        return response.customError(wrapIntoCustomErrorResponse(error));
      }
    }
  );
}
