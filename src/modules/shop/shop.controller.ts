import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import sendNotFoundDataResponse from '../../utils/sendNotFoundDataResponse';
import { ShopService } from './shop.service';
import { IFile } from '../../interface/file.interface';

const createShop = catchAsync(async (req, res) => {
  const newShop = await ShopService.createShopIntoDB(
    req.file as IFile,
    req.body,
  );

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Shop created successfully!',
    data: newShop,
  });
});

const updateShop = catchAsync(async (req, res) => {
  const updatedShop = await ShopService.updateShopIntoDB(
    req.params.id,
    req.user._id,
    req.file as IFile,
    req.body,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Shop updated successfully',
    data: updatedShop,
  });
});

const getAllShops = catchAsync(async (req, res) => {
  const shops = await ShopService.getAllShopsFromDB();

  if (!shops || shops.length < 1) {
    return sendNotFoundDataResponse(res);
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All shops retrieved successfully!',
    data: shops,
  });
});

const getSingleShop = catchAsync(async (req, res) => {
  const Shop = await ShopService.getSingleShopFromDB(req.params.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Shop retrieved successfully!',
    data: Shop,
  });
});

const deleteShop = catchAsync(async (req, res) => {
  const deleteShop = await ShopService.deleteShopFromDB(
    req.params.id,
    req.user._id,
    req.user.role,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Shop deleted successfully!',
    data: deleteShop,
  });
});

const followShop = catchAsync(async (req, res) => {
  const currentUser = req.user;
  const shopId = req.params.id;
  await ShopService.followShop(currentUser, shopId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Follow success!',
    data: null,
  });
});

const unFollowShop = catchAsync(async (req, res) => {
  const currentUser = req.user;
  const shopId = req.params.id;
  await ShopService.unFollowShop(currentUser, shopId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Un-follow success!',
    data: null,
  });
});
export const ShopController = {
  createShop,
  getAllShops,
  getSingleShop,
  updateShop,
  deleteShop,
  unFollowShop,
  followShop,
};
