import { User } from '../payload-types';
import { Access, CollectionConfig } from 'payload/types';

//Access type is provided by payload/types
const isAdminOrHasAccessToImages =
  (): Access =>
  async ({ req }) => {

    const user = req.user as User | undefined;
    if (!user) return false;
    if (user.role === 'admin') return true;

    // if user upload the image then only user can see the image
    return {
      user: {
        equals: req.user.id,
      },
    };
  };

export const Media: CollectionConfig = {
  slug: 'media',
  //req and data are from CMS
  hooks: {
    beforeChange: [
      ({ req, data }) => {
        return { ...data, user: req.user.id };
      },
    ],
  },
  access: {
    read: async ({ req }) => {
      const referer = req.headers.referer;
      // user not logged in and user is not on admin page
      if (!req.user || !referer?.includes('sell')) {
        return true;
      }
      return await isAdminOrHasAccessToImages()({req});
    },
    delete: ({req}) => isAdminOrHasAccessToImages()({req}),
    update: ({req}) => isAdminOrHasAccessToImages()({req})
  },
  admin: {
    hidden: ({ user }) => user.role !== 'admin',
  },
  upload: {
    staticURL: '/media',
    staticDir: 'media',
    imageSizes: [
      {
        name: 'thumbnail',
        width: 400,
        height: 300,
        position: 'centre',
      },
      {
        name: 'card',
        width: 768,
        height: 1024,
        position: 'centre',
      },
      {
        name: 'tablet',
        width: 1024,
        height: undefined,
        position: 'centre',
      },
    ],
    //This assures that file will be image
    mimeTypes: ['image/*'],
  },
  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      hasMany: false,
      admin: {
        condition: () => false,
      },
    },
  ],
};
