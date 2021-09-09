import { IRouter } from 'src/core/server';
// import { wrapIntoCustomErrorResponse } from '../errors';

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

        // The flow is the following (see response format at https://www.elastic.co/guide/en/elasticsearch/reference/current/indices-get-field-mapping.html):
        // 1. Iterate over all matched indices.
        // 2. Extract all the field names from the `mappings` field of the particular index.
        // 3. Collect and flatten the list of the field names, omitting any fields without mappings, and any runtime fields
        // 4. Use `Set` to get only unique field names.

        // referance in: \kibana\x-pack\plugins\security\server\routes\indices\get_fields.ts

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

            // Object.values(indexMappings).flatMap((indexMapping) => {
            //   return Object.keys(indexMapping.mappings).filter((fieldName) => {
            //     const mappingValues = Object.values(indexMapping.mappings[fieldName].mapping);
            //     mappingValues[fieldName] = Object.values(indexMapping.mappings[fieldName].mapping);
            //     const hasMapping = mappingValues.length > 0;

            //     const isRuntimeField = hasMapping && mappingValues[0]?.type === 'runtime';

            //     // fields without mappings are internal fields such as `_routing` and `_index`,
            //     // and therefore don't make sense as autocomplete suggestions for FLS.

            //     // Runtime fields are not securable via FLS.
            //     // Administrators should instead secure access to the fields which derive this information.
            //     return hasMapping && !isRuntimeField;
            //   });
            // })
          )
        );

        return response.ok({
          body: fields,
        });
      } catch (error) {
        return response.customError(wrapIntoCustomErrorResponse(error));
        // console.log('server error: ', error)
      }
      // const client = context.core.elasticsearch.client.asCurrentUser;

      // const { body: result } = await client.search({
      //   index: 'arc-*',
      //   // _source_includes: request.body.selectedFields,
      //   version: true,
      //   size: 10000
      // });
      // const reply = result.hits.hits;
      // return response.ok({
      //   body: {
      //     reply,
      //   },
      // });

    }
  );
}
