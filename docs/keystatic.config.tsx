// keystatic.config.tsx
import {
  config,
  fields,
  collection,
  singleton,
  component,
} from '@keystatic/core';
import { CloudImagePreview } from './src/components/previews/CloudImagePreview';

export const componentBlocks = {
  aside: component({
    preview: props => {
      return (
        <div
          style={{
            display: 'flex',
            gap: '0.5rem',
            borderLeft: '3px',
            borderLeftStyle: 'solid',
            borderLeftColor: '#eee',
            paddingLeft: '0.5rem',
          }}
        >
          <div>{props.fields.icon.element}</div>
          <div>{props.fields.content.element}</div>
        </div>
      );
    },
    label: 'Aside',
    schema: {
      icon: fields.child({
        kind: 'inline',
        placeholder: 'Emoji icon...',
      }),
      content: fields.child({
        kind: 'block',
        placeholder: 'Aside...',
        formatting: {
          inlineMarks: 'inherit',
          softBreaks: 'inherit',
          listTypes: 'inherit',
        },
        links: 'inherit',
      }),
    },
    chromeless: true,
  }),
  'cloud-image': component({
    preview: CloudImagePreview,
    label: 'Cloud image',
    schema: {
      href: fields.text({
        label: 'Href *',
        validation: {
          length: {
            min: 1,
          },
        },
      }),
      alt: fields.text({
        label: 'Alt text',
        description:
          'Include an alt text description or leave blank for decorative images',
      }),
      height: fields.text({
        label: 'Height',
        description:
          'The intrinsic height of the image, in pixels. Must be an integer without a unit - e.g. 100',
      }),
      width: fields.text({
        label: 'Width',
        description:
          'The intrinsic width of the image, in pixels. Must be an integer without a unit - e.g. 100',
      }),
      srcSet: fields.text({
        label: 'Srcset',
        description: 'Optionally override the defualt srcset',
      }),
      sizes: fields.text({
        label: 'Sizes',
        description: 'Optionally override the defualt sizes',
      }),
    },
    chromeless: false,
  }),
};

export default config({
  storage: {
    kind: 'local',
  },
  collections: {
    pages: collection({
      label: 'Pages',
      slugField: 'title',
      format: { contentField: 'content' },
      path: 'src/content/pages/*',
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        content: fields.document({
          label: 'Content',
          formatting: true,
          dividers: true,
          links: true,
          images: { directory: 'public/images/content' },
          componentBlocks,
        }),
      },
    }),
  },
  singletons: {
    navigation: singleton({
      label: 'Navigation',
      path: 'src/content/navigation',
      schema: {
        navGroups: fields.array(
          fields.object({
            groupName: fields.text({ label: 'Group name' }),
            items: fields.array(
              fields.object({
                label: fields.text({
                  label: 'Label',
                  description:
                    "Required when using a URL, or overriding the page's title",
                }),
                link: fields.conditional(
                  fields.select({
                    label: 'Page or URL',
                    options: [
                      { label: 'Page', value: 'page' },
                      { label: 'URL', value: 'url' },
                    ],
                    defaultValue: 'page',
                  }),
                  {
                    page: fields.relationship({
                      label: 'Page',
                      collection: 'pages',
                    }),
                    url: fields.text({ label: 'URL' }),
                  }
                ),
              }),
              {
                label: 'Navigation Links',
                itemLabel: props => props.fields.label.value,
              }
            ),
          }),
          {
            label: 'Navigation groups',
            itemLabel: props => props.fields.groupName.value,
          }
        ),
      },
    }),
  },
});