import { useState } from 'react';
import { isNonEmptyString, isEmail } from 'douhub-helper-util';
import { _window, callAPIBase, getRecaptchaToken } from 'douhub-ui-web-basic';
import  RecaptchaField from 'douhub-ui-web/build/cjs/fields/recaptcha';


const RECAPTCHA_ID = 'introduction-subscribe-beta';

const Introduction = () => {

  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [doing, setDoing] = useState('');
  const [showRecaptcha, setShowRecaptcha] = useState(false);

  const solution = _window.solution;

  const onChangeEmail = (e: any) => {
    const text = e.target.value;
    if (isEmail(text) && !showRecaptcha) {
      setShowRecaptcha(true);
    }
    setEmail(text);
  }

  const onSubmit = () => {
    if (!isEmail(email)) {
      setError('Please provide a valid email address.');
      return;
    }

    const recaptchaToken = getRecaptchaToken(RECAPTCHA_ID);
    if (!isNonEmptyString(recaptchaToken)) {
      setError('Are you a robot? Please finish reRAPTCHA check.');
      return;
    }

    setDoing('Submitting ...');
    setError('');

    callAPIBase(`${solution.apis.platform}subscribe-beta-access`,
      { email, regarding: 'air-drop-core', recaptchaToken }, 'POST', { solutionId: solution.id })
      .then(() => {
        setShowRecaptcha(false);
        setSuccess('Thank you, you email has been submitted successfully, we will let you know as soon as we are ready.')
      })
      .catch(() => {
        setError('Sorry, we can not submit your request at the moment, please try again later or email to support@douhub.com.');
      })
      .finally(() => {
        setDoing('');
      })
  }

  const onClickRecaptcha = () => {
    setError('');
  }

  return <div>
    <div className="mt-16">
      <div className="mt-6">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">
          Get smarter with our daily newsletters
        </h1>
        <p className="my-6 text-xl text-gray-500 ">
        Grow your attitude, skills and knowledge with things not taught in the school
        </p>
      </div>
      {showRecaptcha && <div className="w-full flex my-2">
        <RecaptchaField id={RECAPTCHA_ID} onClick={onClickRecaptcha} />
      </div>}
      <div className="mt-3 sm:max-w-lg sm:w-full sm:flex">
        <div className="min-w-0 flex-1">
          <div className="w-full">
            <input
              onChange={onChangeEmail}
              id="hero-email"
              value={email}
              type="email"
              className="block w-full border border-gray-300 rounded-md p-3 text-base text-gray-900 placeholder-gray-500 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="Enter your email"
            />
          </div>
        </div>
        <div className="mt-2 sm:mt-0 ml-0 sm:ml-3">
          <button
            disabled={isNonEmptyString(doing)}
            onClick={onSubmit}
            type="submit"
            className={`block w-full rounded-md ${isNonEmptyString(doing) ? 'cursor-not-allowed' : 'cursor-pointer'} border border-transparent px-5 py-3 bg-blue-600 text-base font-medium text-white shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:px-10`}
          >
            {isNonEmptyString(doing) ? doing : 'Subscribe'}
          </button>
        </div>
      </div>
      {isNonEmptyString(error) && <div className="mt-4 w-full flex text-red-700" style={{maxWidth:460}}>{error}</div>}
      {isNonEmptyString(success) && <div className="mt-4 w-full flex text-green-700" style={{maxWidth:460}}>{success}</div>}
      <div className="mt-6">
        <p className="mt-3 text-sm text-gray-500"> We care about the protection of your data. Read our <a href="#" className="font-medium underline">Privacy Policy</a>.</p>
      </div>
    </div>
  </div>
}


Introduction.displayName = 'Sections.Primary.Controls.Introduction';
export default Introduction;