import { ResponseSuccess } from 'src/interface/response';

class BaseResponse {
  _success(message: string, data?: any): ResponseSuccess {
    return {
      status: 'Success',
      message: message,
      data: data || {},
    };
  }
}

export default BaseResponse;
