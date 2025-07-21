export const formatPaginationResponse = (paginationResult, params, req) => {
  const { page, totalPages } = paginationResult;
  const baseUrl = `${req.protocol}://${req.get('host')}${req.baseUrl}${req.path}`;

  // Generate pagination links (only second page and last page)
  const links = [];

  // Add second page link if it exists (totalPages >= 2)
  if (totalPages >= 2) {
    links.push({
      url: `${baseUrl}?paginate_count=${paginationResult.limit}&page=2`,
      label: '2',
      active: page === 2,
    });
  }

  // Add last page link if different from second page (totalPages > 2)
  if (totalPages > 2) {
    links.push({
      url: `${baseUrl}?paginate_count=${paginationResult.limit}&page=${totalPages}`,
      label: `${totalPages}`,
      active: page === totalPages,
    });
  }

  return {
    data: paginationResult.docs,
    params,
    pagination: {
      current_page: paginationResult.page,
      per_page: paginationResult.limit,
      total: paginationResult.totalDocs,
      last_page: paginationResult.totalPages,
      from: paginationResult.pagingCounter,
      to: paginationResult.pagingCounter + paginationResult.docs.length - 1,
      links, // Include only second and last page links
    },
  };
};