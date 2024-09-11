import { useSignal } from "@preact/signals";
import Counter from "@/islands/counter.tsx";
import { DatePickerDemo } from "@/islands/date_picker.tsx";
import GifCard from "@/islands/gifcard.tsx";
import { AccordionDemo } from "@/islands/accordion_demo.tsx";
import { CarouselDemo } from "@/components/carousel_demo.tsx";
import { InputOTPDemo } from "@/components/input_otp_demo.tsx";
import { ToastDemo } from "@/islands/toast_demo.tsx";
import { Button } from "@/components/ui/button/mod.tsx";

export default function Home() {
  const count = useSignal(4);
  return (
    <div>
      <div className="px-4 py-8 mx-auto bg-black text-white">
        <div className="max-w-screen-md mx-auto flex flex-col items-center justify-center">
          <img
            className="my-6"
            src="/logo.svg"
            width="128"
            height="128"
            alt="the Fresh logo: a sliced lemon dripping with juice"
          />
          <h1 className="text-4xl font-bold">Welcome to Fresh + shadcn</h1>
          <p className="my-4">
            Try updating this message in the
            <code className="mx-2">./routes/index.tsx</code> file, and refresh.
          </p>
          <Counter count={count} />
        </div>
      </div>
      <div className="my-10 flex items-center justify-center flex-col">
        <h1 className="text-6xl font-extrabold lg:text-7xl">
          Select your favorite date
        </h1>
        <div className="mt-8">
          <DatePickerDemo />
        </div>
      </div>
      <div className="my-10 flex items-center justify-center flex-col">
        <div className="my-10 flex items-center justify-center flex-col">
          <GifCard />
        </div>
        <div className="mx-10 md:w-[400px] my-10 flex items-center justify-center flex-col">
          <AccordionDemo />
        </div>
        <div className="mx-10 md:w-[400px] my-10 flex items-center justify-center flex-col">
          <CarouselDemo />
        </div>
        <div className="mx-10 md:w-[400px] my-10 flex items-center justify-center flex-col">
          <InputOTPDemo />
        </div>
        <div className="mx-10 md:w-[400px] my-10 flex items-center justify-center flex-col">
          <ToastDemo />
        </div>
        <div className="mx-10 md:w-[400px] my-10 flex items-center justify-center flex-col">
          <Button asChild>
            <a href="/charts">Go to charts</a>
          </Button>
        </div>
      </div>
      <div className="m-6 flex items-center justify-center border-2 border-black">
        <div className="m-10 md:w-[400px]">
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
            The Joke Tax Chronicles
          </h1>
          <p className="leading-7 [&:not(:first-child)]:mt-6">
            Once upon a time, in a far-off land, there was a very lazy king who
            spent all day lounging on his throne. One day, his advisors came to
            him with a problem: the kingdom was running out of money.
          </p>
          <h2 className="mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
            The King's Plan
          </h2>
          <p className="leading-7 [&:not(:first-child)]:mt-6">
            The king thought long and hard, and finally came up with{" "}
            <a
              href="#"
              className="font-medium text-primary underline underline-offset-4"
            >
              a brilliant plan
            </a>
            : he would tax the jokes in the kingdom.
          </p>
          <blockquote className="mt-6 border-l-2 pl-6 italic">
            "After all," he said, "everyone enjoys a good joke, so it's only
            fair that they should pay for the privilege."
          </blockquote>
          <h3 className="mt-8 scroll-m-20 text-2xl font-semibold tracking-tight">
            The Joke Tax
          </h3>
          <p className="leading-7 [&:not(:first-child)]:mt-6">
            The king's subjects were not amused. They grumbled and complained,
            but the king was firm:
          </p>
          <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
            <li>1st level of puns: 5 gold coins</li>
            <li>2nd level of jokes: 10 gold coins</li>
            <li>3rd level of one-liners : 20 gold coins</li>
          </ul>
          <p className="leading-7 [&:not(:first-child)]:mt-6">
            As a result, people stopped telling jokes, and the kingdom fell into
            a gloom. But there was one person who refused to let the king's
            foolishness get him down: a court jester named Jokester.
          </p>
          <h3 className="mt-8 scroll-m-20 text-2xl font-semibold tracking-tight">
            Jokester's Revolt
          </h3>
          <p className="leading-7 [&:not(:first-child)]:mt-6">
            Jokester began sneaking into the castle in the middle of the night
            and leaving jokes all over the place: under the king's pillow, in
            his soup, even in the royal toilet. The king was furious, but he
            couldn't seem to stop Jokester.
          </p>
          <p className="leading-7 [&:not(:first-child)]:mt-6">
            And then, one day, the people of the kingdom discovered that the
            jokes left by Jokester were so funny that they couldn't help but
            laugh. And once they started laughing, they couldn't stop.
          </p>
          <h3 className="mt-8 scroll-m-20 text-2xl font-semibold tracking-tight">
            The People's Rebellion
          </h3>
          <p className="leading-7 [&:not(:first-child)]:mt-6">
            The people of the kingdom, feeling uplifted by the laughter, started
            to tell jokes and puns again, and soon the entire kingdom was in on
            the joke.
          </p>
          <div className="my-6 w-full overflow-y-auto">
            <table className="w-full">
              <thead>
                <tr className="m-0 border-t p-0 even:bg-muted">
                  <th className="border px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right">
                    King's Treasury
                  </th>
                  <th className="border px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right">
                    People's happiness
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="m-0 border-t p-0 even:bg-muted">
                  <td className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right">
                    Empty
                  </td>
                  <td className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right">
                    Overflowing
                  </td>
                </tr>
                <tr className="m-0 border-t p-0 even:bg-muted">
                  <td className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right">
                    Modest
                  </td>
                  <td className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right">
                    Satisfied
                  </td>
                </tr>
                <tr className="m-0 border-t p-0 even:bg-muted">
                  <td className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right">
                    Full
                  </td>
                  <td className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right">
                    Ecstatic
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="leading-7 [&:not(:first-child)]:mt-6">
            The king, seeing how much happier his subjects were, realized the
            error of his ways and repealed the joke tax. Jokester was declared a
            hero, and the kingdom lived happily ever after.
          </p>
          <p className="leading-7 [&:not(:first-child)]:mt-6">
            The moral of the story is: never underestimate the power of a good
            laugh and always be careful of bad ideas.
          </p>
        </div>
      </div>
    </div>
  );
}
