import { Metadata } from 'next';
import { NippoBreadcrumbs } from './_components/NippoBreadcrumbs';
import { getNippoByDate } from '~/app/_actions/nippoActions';
import { getObjectiveBySlug } from '~/app/_actions/objectiveActions';
import { URLS } from '~/app/_constants/urls';
import { generateNippoMetadata } from '~/libs/generateNippoMetadata';
import { fetchMe } from '~/app/_actions/userActions';
import { NippoEditor } from '~/app/_components/domains/Nippo/NippoEditor';
import { getDateString } from '~/libs/getDateString';
import { NippoPreview } from '~/app/_components/domains/Nippo/NippoPreview';
import { NippoShareIcon } from '~/app/_components/domains/Nippo/NippoShareIcon';
import { TaskList } from '~/app/_components/domains/Task/TaskList';

type Props = { params: { slug: string; date: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const [{ objective }] = await Promise.all([getObjectiveBySlug(params.slug)]);
  const dateString = getDateString(params.date);

  return generateNippoMetadata({ title: `${objective.name}:${dateString}`, url: URLS.SLUG_DATE(params.slug, params.date) });
}

export default async function Page({ params }: Props) {
  const [{ objective }, { nippo }, { currentUser }] = await Promise.all([
    getObjectiveBySlug(params.slug),
    getNippoByDate(params.slug, params.date),
    fetchMe(),
  ]);
  const dateString = getDateString(params.date);

  return (
    <div className="drop-shadow-sm">
      <div className="min-h-[500px] max-w-[1024px] mx-auto flex gap-[16px] md:gap-[48px]">
        <div className="px-[8px] pt-[8px] pb-[32px] w-[100%]">
          <NippoBreadcrumbs objective={objective} date={dateString} />
          <div className="mt-[32px] mb-[8px] flex justify-between">
            <p className="text-xl font-bold text-gray-700">{dateString}</p>
            {nippo && <NippoShareIcon slug={objective.slug} nippo={nippo} />}
          </div>
          <p className="mt-[32px] text-xl font-bold mb-[8px] text-gray-700">{dateString}</p>
          <div className="flex gap-[16px] md:flex-row flex-col">
            <div className="flex-1">
              {currentUser?._id === objective.createdUserId ? (
                <NippoEditor objectiveId={objective._id} nippo={nippo} date={params.date} />
              ) : (
                <NippoPreview nippo={nippo} />
              )}
            </div>
            <div className="w-[100%] md:w-[200px]">
              <TaskList />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
