export type BaseURLConfig = {
  /**
  The URL string to prepend.

  @default ''
  */
  url: string;

  /**
  Tags to apply the `url` to. When using this option, the `url` will only be prepended to the specified tags.

  @example

  Using an array of strings representing tag names:

  ```
  baseUrl({
    url: 'https://cdn.example.com/',
    tags: ['img'],
  })
  ```

  Using an object to specify tags and their attributes to apply the `url` to:

  ```
  baseUrl({
    url: 'https://foo.com/',
    tags: {
      img: {
        src: true,
        srcset: 'https://bar.com/',
      },
    },
  })
  ```
  */
  tags?: string[] | Record<string, unknown>;

  /**
  Key-value pairs of attributes and the string to prepend to their existing value.

  @default {}

  @example

  Prepend `https://example.com/` to all `data-url` attribute values:

  ```
  baseUrl({
    attributes: {
      'data-url': 'https://example.com/',
    }
  })
  ```
  */
  attributes?: Record<string, unknown>;

  /**
  Whether the string defined in `url` should be prepended to `url()` values in CSS `<style>` tags.

  @default false
  */
  styleTag?: boolean;

  /**
  Whether the string defined in `url` should be prepended to `url()` values in inline CSS.

  @default false
  */
  inlineCss?: boolean;

  /**
  Prepend the `url` to all known tags, not just those defined in `tags`.

  @default false
  */
  allTags?: boolean;
};
