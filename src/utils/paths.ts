export const getAssetUrl = (assetPath: string): string => {
  return `${import.meta.env.BASE_URL}${assetPath.replace(/^\/+/, "")}`;
};
