import { createAuthResolver } from 'utils/resolvers';
import { Context } from 'types/server';
import { getDataSourceAndUserId } from 'utils/context';
import { MessageEvents } from './events';
import { NotImplementedError } from 'utils/errors';

const resolver = {
  Query: {
    GetMessage: createAuthResolver(() => {
      throw new NotImplementedError('not implemented');
    }),
    GetMessages: createAuthResolver<{ chatId: number }>((_, args, context: Context) => {
      const { dataSource, userId } = getDataSourceAndUserId(context, 'messages');
      return dataSource.getMessages(userId, args.chatId);
    })
  },
  Mutation: {
    AddMessage: createAuthResolver<{ content: string; chatId: number }>(async (_, args, context: Context) => {
      const { dataSource, userId } = getDataSourceAndUserId(context, 'messages');

      const msg = await dataSource.addMessage(userId, {
        chatId: args.chatId,
        content: args.content
      });
      context.pubsub.publish(`${MessageEvents.MESSAGE_WAS_ADDED}_${args.chatId}`, { msg });
      return msg;
    }),
    DeleteMessage: createAuthResolver<{ id: number }>((_, args, context: Context) => {
      const { dataSource, userId } = getDataSourceAndUserId(context, 'messages');
      return dataSource.deleteMessage(userId, args.id);
    }),
    ReadMessage: createAuthResolver<{ id: number }>(async (_, args, context: Context) => {
      const { dataSource, userId } = getDataSourceAndUserId(context, 'messages');
      const msg = await dataSource.doReadMessage(userId, args.id);
      context.pubsub.publish(`${MessageEvents.MESSAGE_IS_READ}_${args.id}`, args.id);
      return msg;
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
      subscribe: (_, args, { pubsub }) => {
        return pubsub.subscribe(`${MessageEvents.MESSAGE_IS_READ}_${args.msgId}`);
      },
      resolve: payload => {
        return payload;
      }
    }
  }
};

export default resolver;
