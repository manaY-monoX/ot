import { notFound } from 'next/navigation';
import type { Metadata, ResolvingMetadata } from 'next';
import { getWorksDetail } from '@/app/_libs/microcms';
import Article from '@/app/_components/Article';

// 基本となるパラメータ型の定義
type Params = {
  slug: string;
};

type SearchParams = {
  dk?: string;
};

// ページコンポーネントのProps型
type Props = {
  params: Promise<Params>;
  searchParams?: Promise<SearchParams>;
};

export async function generateMetadata(
  props: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // パラメータを解決
  const params = await props.params;
  const searchParams = props.searchParams ? await props.searchParams : {};

  const data = await getWorksDetail(params.slug, {
    draftKey: searchParams.dk,
  });

  return {
    title: data.title,
    description: data.description,
    openGraph: {
      title: data.title,
      description: data.description,
      images: [data?.thumbnail?.url ?? ''],
    },
  };
}

export default async function Page(props: Props) {
  // パラメータを解決
  const params = await props.params;
  const searchParams = props.searchParams ? await props.searchParams : {};

  const data = await getWorksDetail(params.slug, {
    draftKey: searchParams.dk,
  }).catch(notFound);

  return (
    <>
      <Article data={data} contentType="works" />
    </>
  );
}