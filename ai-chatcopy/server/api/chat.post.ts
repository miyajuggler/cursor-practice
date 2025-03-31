import { ChatOpenAI } from '@langchain/openai';
import { ChatAnthropic } from '@langchain/anthropic';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { message, model } = body;

  // APIキーの存在確認
  if (!process.env.OPENAI_API_KEY) {
    throw createError({
      statusCode: 500,
      message:
        'OpenAI APIキーが設定されていません。.envファイルを確認してください。',
    });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    throw createError({
      statusCode: 500,
      message:
        'Anthropic APIキーが設定されていません。.envファイルを確認してください。',
    });
  }

  if (!process.env.GOOGLE_API_KEY) {
    throw createError({
      statusCode: 500,
      message:
        'Google APIキーが設定されていません。.envファイルを確認してください。',
    });
  }

  let chatModel;
  try {
    switch (model) {
      case 'openai':
        chatModel = new ChatOpenAI({
          openAIApiKey: process.env.OPENAI_API_KEY,
          modelName: 'gpt-4o-2024-08-06',
        });
        break;
      case 'claude':
        chatModel = new ChatAnthropic({
          anthropicApiKey: process.env.ANTHROPIC_API_KEY,
          modelName: 'claude-3-5-sonnet-20241022',
        });
        break;
      case 'gemini':
        chatModel = new ChatGoogleGenerativeAI({
          apiKey: process.env.GOOGLE_API_KEY,
          modelName: 'gemini-2.5-pro-exp-03-25',
        });
        break;
      default:
        throw new Error('無効なモデルが指定されました');
    }
  } catch (error) {
    console.error('モデル初期化エラー:', error);
    throw createError({
      statusCode: 500,
      message: `モデルの初期化に失敗しました: ${error.message}`,
    });
  }

  try {
    const response = await chatModel.invoke(message);
    return { response: response.content };
  } catch (error) {
    console.error('API呼び出しエラー:', error);
    throw createError({
      statusCode: 500,
      message: `API呼び出しに失敗しました: ${error.message}`,
    });
  }
});
