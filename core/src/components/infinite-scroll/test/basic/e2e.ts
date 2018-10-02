import { newE2EPage } from '@stencil/core/testing';

it('infinite-scroll: basic', async () => {
  const page = await newE2EPage({
    url: '/src/components/infinite-scroll/test/basic?ionic:animated=false'
  });

  const compare = await page.compareScreenshot();
  expect(compare).toMatchScreenshot();
});