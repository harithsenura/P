'use server';
import * as cheerio from 'cheerio';

export type Activity = {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
};

export async function fetchGithubContributions(username: string, year: number): Promise<Activity[]> {
  try {
    const response = await fetch(`https://github.com/users/${username}/contributions?from=${year}-01-01&to=${year}-12-31`, {
      next: { revalidate: 3600 } // Cache for 1 hour
    });
    const html = await response.text();
    const $ = cheerio.load(html);
    const contributions: Activity[] = [];

    $('td.ContributionCalendar-day').each((_, el) => {
      const date = $(el).attr('data-date');
      const level = parseInt($(el).attr('data-level') || '0', 10);
      const id = $(el).attr('id');
      
      let count = 0;
      if (id) {
        const tooltip = $(`tool-tip[for="${id}"]`).text().trim();
        if (tooltip && !tooltip.toLowerCase().includes('no contributions')) {
          const match = tooltip.match(/^(\d+)/);
          if (match) {
            count = parseInt(match[1], 10);
          }
        }
      }

      if (date) {
        contributions.push({
          date,
          count,
          level: level as 0 | 1 | 2 | 3 | 4,
        });
      }
    });

    return contributions;
  } catch (error) {
    console.error('Failed to fetch github contributions', error);
    return [];
  }
}
