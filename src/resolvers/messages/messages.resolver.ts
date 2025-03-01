import { createAuthResolver, parseQueryFields } from 'utils/resolvers';
import { Context } from 'types/server';
import { getDataSourceAndUserId } from 'utils/context';
import { MessageEvents } from './events';
import { get } from 'lodash';
import { MessageUpload } from 'types/messages';

const resolver = {
  Query: {
    GetMessage: createAuthResolver<{ messageId: number }>((_, args, context: Context) => {
      const { dataSource, userId } = getDataSourceAndUserId(context, 'messages');
      return dataSource.getMessageById(userId, args.messageId);
    }),
    GetMessages: createAuthResolver<{ chatId: number; page: number; size: number }>(
      (_, args, context: Context, info) => {
        const { dataSource, userId } = getDataSourceAndUserId(context, 'messages');
        const queryFields = parseQueryFields(info);

        return dataSource.getMessages(
          userId,
          { chatId: args.chatId, page: args.page, size: args.size },
          get(queryFields, 'data.fieldsByTypeName.Message')
        );
      }
    ),
    GetS3PutObjectUrl: createAuthResolver<{ type: string }>((_, args, context: Context, info) => {
      const { dataSource } = getDataSourceAndUserId(context, 's3Provider');
      return dataSource.generateS3PutObject(args.type);
    })
  },
  Mutation: {
    AddMessage: createAuthResolver<{ content: string; chatId: number; uploads: MessageUpload[] }>(
      async (_, args, context: Context) => {
        const { dataSource, userId } = getDataSourceAndUserId(context, 'messages');

        const msg = await dataSource.addMessage(userId, {
          chatId: args.chatId,
          content: args.content,
          uploads: args.uploads
        });
        context.pubsub.publish(`${MessageEvents.MESSAGE_WAS_ADDED}_${args.chatId}`, { msg });
        return msg;
      }
    ),
    DeleteMessage: createAuthResolver<{ id: number }>((_, args, context: Context) => {
      const { dataSource, userId } = getDataSourceAndUserId(context, 'messages');
      return dataSource.deleteMessage(userId, args.id);
    }),
    ReadMessage: createAuthResolver<{ id: number }>(async (_, args, context: Context) => {
      const { dataSource, userId } = getDataSourceAndUserId(context, 'messages');
      const result = await dataSource.doReadMessage(userId, args.id);
      context.pubsub.publish(`${result.owner.id}_${MessageEvents.MESSAGE_IS_READ}`, result);

      return args.id;
    })
  },
  Subscription: {
    MessageReceived: {
      subscribe: (_, args, { pubsub }) => {
        return pubsub.subscribe(`${MessageEvents.MESSAGE_WAS_ADDED}_${args.chatId}`);
      },
      resolve: payload => {
        return payload.msg;
      }
    },
    MessageIsRead: {
      subscribe: (_, __, context) => {
        const { userId } = getDataSourceAndUserId(context, 'messages');
        return context.pubsub.subscribe(`${userId}_${MessageEvents.MESSAGE_IS_READ}`);
      },
      resolve: payload => {
        return payload;
      }
    }
  }
};

export default resolver;
