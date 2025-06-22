// services/itemService.js
const createItem = async (Item, { name, SKU, threshold, pictureUrl }) => {
  const existing = await Item.findOne({ where: { SKU } });
  if (existing) throw new Error('Item with this SKU already exists');

  const item = await Item.create({
    name,
    SKU,
    threshold,
    pictureUrl, 
  });

  return item;
};


const getAllItems = async (Item) => {
  const items = await Item.findAll({
    order: [['createdAt', 'DESC']], 
  });
  return items;
};

const updateItemById = async (Item, id, updatedData) => {
  const item = await Item.findOne({ where: { id: id } });

  if (!item) {
    throw new Error('Item not found with the given id');
  }

  await item.update(updatedData);
  return item;
};

const deleteItemById = async (Item, id) => {
  const item = await Item.findOne({ where: { id: id } });

  if (!item) {
    throw new Error('Item not found with the given id');
  }

  await item.destroy();
  return { message: `Item with id ${id} deleted` };
};

export default {
  createItem,
  getAllItems,
  updateItemById,
  deleteItemById,
};


